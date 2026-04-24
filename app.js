'use strict';

/* ─────────────────────────────────────────────────────────────────────────────
   CONFIG  — update PROXY_URL after deploying to Render
───────────────────────────────────────────────────────────────────────────── */
const PROXY_URL = 'https://simcompanies-advisor.onrender.com'; // ← your Render URL
const BASE      = 'https://www.simcompanies.com';              // for image src only
const TTL       = 5 * 60 * 1000;

/* ─────────────────────────────────────────────────────────────────────────────
   SESSION COOKIE  (stored in localStorage, sent as X-Sim-Cookie header)
───────────────────────────────────────────────────────────────────────────── */
function getStoredCookie() { return localStorage.getItem('sc_cookie') || ''; }
function saveStoredCookie(v) { localStorage.setItem('sc_cookie', v.trim()); }
function clearStoredCookie() { localStorage.removeItem('sc_cookie'); }

/* ─────────────────────────────────────────────────────────────────────────────
   CACHE  (localStorage, per-key TTL)
───────────────────────────────────────────────────────────────────────────── */
function cGet(k) {
  try {
    const raw = localStorage.getItem('sc_' + k);
    if (!raw) return null;
    const { d, t } = JSON.parse(raw);
    return (Date.now() - t < TTL) ? d : null;
  } catch { return null; }
}
function cSet(k, d) {
  try { localStorage.setItem('sc_' + k, JSON.stringify({ d, t: Date.now() })); } catch {}
}
function cAge(k) {
  try {
    const raw = localStorage.getItem('sc_' + k);
    if (!raw) return null;
    return Math.floor((Date.now() - JSON.parse(raw).t) / 1000);
  } catch { return null; }
}
function cClear() {
  Object.keys(localStorage)
    .filter(k => k.startsWith('sc_') && k !== 'sc_cookie')
    .forEach(k => localStorage.removeItem(k));
}

/* ─────────────────────────────────────────────────────────────────────────────
   FETCH via proxy
───────────────────────────────────────────────────────────────────────────── */
async function apiFetch(path, cacheKey, force = false) {
  if (!force) {
    const hit = cGet(cacheKey);
    if (hit !== null) return hit;
  }
  const res = await fetch(PROXY_URL + path, {
    headers: { 'X-Sim-Cookie': getStoredCookie() },
  });
  if (res.status === 401 || res.status === 403) throw { type: 'auth', status: res.status, path };
  if (!res.ok) throw { type: 'http', status: res.status, path };
  const data = await res.json();
  cSet(cacheKey, data);
  return data;
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────────────────────────── */
const S = {
  company:      null,
  buildings:    [],
  encBuildings: [],
  encResources: [],
  ticker:       [],
  balance:      null,
  income:       null,
  cashflow:     null,
  aoPreview:    null,
};

let surRows = [];
let defRows = [];
const sortSt = { s: { col: 'net', dir: 'desc' }, d: { col: 'net', dir: 'asc' } };

/* ─────────────────────────────────────────────────────────────────────────────
   SETUP MODAL
───────────────────────────────────────────────────────────────────────────── */
function showSetup(opts = {}) {
  const modal = document.getElementById('setupModal');
  if (opts.error) {
    document.getElementById('setupError').textContent = opts.error;
    document.getElementById('setupError').style.display = 'block';
  } else {
    document.getElementById('setupError').style.display = 'none';
  }
  modal.style.display = 'flex';
  document.getElementById('cookieInput').focus();
}
function hideSetup() {
  document.getElementById('setupModal').style.display = 'none';
}

document.getElementById('saveSessionBtn').addEventListener('click', () => {
  const val = document.getElementById('cookieInput').value.trim();
  if (!val) {
    document.getElementById('setupError').textContent = 'Paste your cookie string first.';
    document.getElementById('setupError').style.display = 'block';
    return;
  }
  saveStoredCookie(val);
  hideSetup();
  loadAll(true);
});

document.getElementById('cookieInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('saveSessionBtn').click();
});

// Header "Update session" link
document.getElementById('updateSessionBtn').addEventListener('click', () => {
  document.getElementById('cookieInput').value = getStoredCookie();
  showSetup();
});

/* ─────────────────────────────────────────────────────────────────────────────
   STATUS / ERROR
───────────────────────────────────────────────────────────────────────────── */
function status(msg, loading) {
  document.getElementById('stext').textContent = msg;
  document.getElementById('spin').style.display = loading ? 'block' : 'none';
}
function showErr(msg, detail) {
  document.getElementById('errBox').innerHTML =
    `<div class="error-box"><strong>Error:</strong> ${msg}` +
    (detail ? `<br><small style="color:#fca5a5">${detail}</small>` : '') + `</div>`;
}
function clearErr() { document.getElementById('errBox').innerHTML = ''; }

/* ─────────────────────────────────────────────────────────────────────────────
   ENCYCLOPEDIA BUILDINGS — try several URL patterns until one works
───────────────────────────────────────────────────────────────────────────── */
const ENC_BLD_URLS = [
  '/api/v3/en/encyclopedia/buildings/',
  '/api/v4/en/0/encyclopedia/buildings/',
  '/api/v3/0/encyclopedia/buildings/',
  '/api/v3/0/encyclopedia/buildings/k/',
];

async function fetchEncBuildings(force) {
  for (const url of ENC_BLD_URLS) {
    try {
      const data = await apiFetch(url, 'enc_bld', force);
      console.log('Buildings encyclopedia loaded from:', url);
      return data;
    } catch (e) {
      console.warn('Buildings enc failed for', url, e?.status);
    }
  }
  console.error('All buildings encyclopedia URLs failed — production recipes unavailable');
  return [];
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN LOAD
───────────────────────────────────────────────────────────────────────────── */
async function loadAll(force = false) {
  // If no cookie stored, show setup first
  if (!getStoredCookie()) { showSetup(); return; }

  clearErr();
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true;
  if (force) cClear();

  try {
    status('Checking authentication…', true);
    const auth = await apiFetch('/api/v3/companies/auth-data/', 'auth', force);
    S.company = auth.authCompany;
    renderHeader(S.company, null);

    status('Fetching game data…', true);
    const [
      buildings, encB, encR, ticker,
      balance, income, cashflow, aoPreview,
    ] = await Promise.all([
      apiFetch('/api/v2/companies/me/buildings/',                        'buildings',  force).catch(() => []),
      fetchEncBuildings(force),
      apiFetch('/api/v3/en/encyclopedia/resources/',                     'enc_res',    force).catch(() => []),
      apiFetch('/api/v3/market-ticker/0/',                               'ticker',     force).catch(() => []),
      apiFetch('/api/v2/companies/me/balance-sheet/',                    'balance',    force).catch(() => null),
      apiFetch('/api/v2/companies/me/income-statement/',                 'income',     force).catch(() => null),
      apiFetch('/api/v2/companies/me/cashflow/recent/',                  'cashflow',   force).catch(() => null),
      apiFetch('/api/v2/companies/me/administration-overhead/plus-one/', 'ao_preview', force).catch(() => null),
    ]);

    S.buildings    = arr(buildings);
    S.encBuildings = arr(encB);
    S.encResources = arr(encR);
    S.ticker       = arr(ticker);
    S.balance      = balance;
    S.income       = income;
    S.cashflow     = cashflow;
    S.aoPreview    = aoPreview;

    status('Calculating…', true);
    calculate();

    renderHeader(S.company, S.balance);
    renderFinancials();
    renderSurplus();
    renderDeficit();

    const age  = cAge('auth');
    const mins = Math.max(0, Math.ceil((TTL - age * 1000) / 60000));
    status(`Updated ${age < 60 ? age + 's' : Math.floor(age / 60) + 'm'} ago — next refresh in ${mins}m`, false);

  } catch (err) {
    console.error(err);
    if (err && err.type === 'auth') {
      clearStoredCookie();
      showSetup({ error: 'Session expired or invalid — please paste a fresh cookie.' });
      status('Authentication required', false);
    } else {
      showErr(
        'Failed to load data.',
        `${err?.path || ''} — status ${err?.status || 'network error'}. Check the browser console.`
      );
      status('Load failed', false);
    }
  } finally {
    btn.disabled = false;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   HEADER
───────────────────────────────────────────────────────────────────────────── */
function renderHeader(co, bal) {
  if (!co) return;
  document.getElementById('hName').textContent = co.name;
  document.getElementById('hMeta').textContent =
    `Level ${co.level}  ·  AO ${fmtAO(co.adminOverhead)}  ·  Realm ${co.realm === 1 ? 'Speed' : 'Standard'}`;
  if (co.logo) {
    document.getElementById('hLogo').innerHTML =
      `<img src="${BASE}${co.logo}" onerror="this.parentNode.textContent='🏭'">`;
  }
  if (bal && bal.cash != null) {
    document.getElementById('hCash').textContent = fmtSC(bal.cash) + ' SC';
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   FINANCIALS
───────────────────────────────────────────────────────────────────────────── */
function renderFinancials() {
  document.getElementById('finCard').style.display = 'block';

  const bal = S.balance;
  const inc = S.income;
  const cf  = S.cashflow;
  const ao  = S.aoPreview;
  const items = [];

  if (bal) {
    items.push({ lbl: 'Cash',               val: fmtSC(bal.cash),                    cls: 'gold' });
    if (bal.cashReservedForOrders)
      items.push({ lbl: 'Reserved (Orders)', val: fmtSC(bal.cashReservedForOrders),  cls: '' });
    if (bal.workInProcess)
      items.push({ lbl: 'Work in Process',   val: fmtSC(bal.workInProcess),           cls: '' });
    if (bal.accountsReceivable)
      items.push({ lbl: 'Accounts Rec.',     val: fmtSC(bal.accountsReceivable),      cls: 'pos' });
  }
  if (inc) {
    items.push({ lbl: 'Revenue (Period)', val: fmtSC(inc.sales || 0),                cls: 'pos' });
    items.push({ lbl: 'COGS (Period)',    val: fmtSC(Math.abs(inc.cogs || 0)),       cls: 'neg' });
    const gp = (inc.sales || 0) + (inc.cogs || 0) + (inc.freightOut || 0);
    items.push({ lbl: 'Gross Profit',     val: fmtSC(gp),                            cls: gp >= 0 ? 'pos' : 'neg' });
  }
  if (ao != null) {
    items.push({ lbl: 'AO if +1 Building', val: fmtAO(ao), cls: '' });
  }

  document.getElementById('finGrid').innerHTML = items.map(i =>
    `<div class="fin-item">
       <div class="fin-lbl">${i.lbl}</div>
       <div class="fin-val ${i.cls}">${i.val}<span class="unit">SC</span></div>
     </div>`
  ).join('');

  const txnEl = document.getElementById('txnWrap');
  if (cf && cf.data && cf.data.length) {
    const rows = cf.data.slice(0, 8).map(t => {
      const amt = t.amount != null ? t.amount : (t.change || 0);
      return `<div class="txn">
        <span>${esc(t.description || t.type || 'Transaction')}</span>
        <span class="txn-amt ${amt >= 0 ? 'pos' : 'neg'}">${amt >= 0 ? '+' : ''}${fmtSC(amt)} SC</span>
      </div>`;
    }).join('');
    txnEl.innerHTML = `<div class="txn-wrap"><div class="txn-label">Recent Transactions</div>${rows}</div>`;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   CALCULATION ENGINE
───────────────────────────────────────────────────────────────────────────── */
function calculate() {
  const marketMap = buildMarketMap();
  const encBldMap = buildEncBldMap();
  const encResMap = buildEncResMap();
  const ao        = aoMultiplier(S.company?.adminOverhead);

  const produced = {};
  const consumed = {};

  for (const bld of S.buildings) {
    const enc = matchEncBuilding(bld, encBldMap);
    if (!enc) continue;
    const prod = enc.production;
    if (!prod) continue;

    const pph    = +(prod.producedAnHour || enc.producedAnHour || 0);
    if (!pph) continue;

    const outKind = prod.output?.kind ?? prod.outputKind ?? null;
    if (outKind == null) continue;

    const outAmt   = +(prod.output?.amount ?? prod.outputAmount ?? 1) || 1;
    const unitsDay = pph * ao * 24;

    produced[outKind] = (produced[outKind] || 0) + unitsDay;

    for (const inp of (prod.inputs || [])) {
      const inpKind = inp.kind ?? inp.resource ?? null;
      if (inpKind == null) continue;
      const inpAmt = +(inp.amount ?? inp.quantity ?? 0);
      consumed[inpKind] = (consumed[inpKind] || 0) + (inpAmt / outAmt) * unitsDay;
    }
  }

  surRows = [];
  defRows = [];
  const allKinds = new Set([...Object.keys(produced), ...Object.keys(consumed)].map(Number));

  for (const kind of allKinds) {
    const p   = produced[kind] || 0;
    const c   = consumed[kind] || 0;
    const net = p - c;
    if (Math.abs(net) < 0.001) continue;

    const res   = encResMap[kind];
    const name  = res?.name  || `Resource #${kind}`;
    const image = res?.image || null;
    const price = marketMap[kind] || 0;

    if (net > 0) {
      surRows.push({ kind, name, image, produced: p, consumed: c, net, price, mv: net * price });
    } else {
      const deficit = Math.abs(net);
      const buyCost = deficit * price;
      const mvb     = calcMVB(kind, deficit, marketMap);
      const rec     = mvb ? (mvb.buyTotal <= mvb.makeTotal ? 'buy' : 'make') : 'buy';
      defRows.push({ kind, name, image, produced: p, consumed: c, net, price, buyCost, mvb, rec });
    }
  }

  doSort('s');
  doSort('d');
}

function aoMultiplier(raw) {
  if (raw == null || raw === 0) return 1;
  if (raw > 1 && raw < 4)    return Math.max(0, 2 - raw);
  if (raw > 0 && raw < 1)    return Math.max(0, 1 - raw);
  if (raw >= 1 && raw <= 100) return Math.max(0, 1 - raw / 100);
  return 1;
}

function buildMarketMap() {
  const m = {};
  for (const t of S.ticker) if (t.kind != null) m[+t.kind] = +(t.price || 0);
  return m;
}
function buildEncBldMap() {
  const m = {};
  for (const b of S.encBuildings) {
    if (b.kind) m[String(b.kind).toLowerCase()] = b;
    if (b.name) m[b.name.toLowerCase()] = b;
  }
  return m;
}
function buildEncResMap() {
  const m = {};
  for (const r of S.encResources) {
    if (r.kind != null) m[+r.kind] = r;
    if (r.db   != null) m[+r.db]   = r;
  }
  return m;
}
function matchEncBuilding(bld, map) {
  return (bld.kind && map[String(bld.kind).toLowerCase()])
      || (bld.name && map[bld.name.toLowerCase()])
      || null;
}

function calcMVB(kindId, deficitPerDay, marketMap) {
  const enc = S.encBuildings.find(e => {
    const p = e.production;
    if (!p) return false;
    return +(p.output?.kind ?? p.outputKind) === +kindId;
  });
  if (!enc) return null;

  const prod   = enc.production;
  const pph    = +(prod.producedAnHour || enc.producedAnHour || 1);
  const wages  = +(enc.wages || 0);
  const outAmt = +(prod.output?.amount ?? prod.outputAmount ?? 1) || 1;

  const wageCPU = wages / pph;
  let matCPU = 0;
  for (const inp of (prod.inputs || [])) {
    const ik = inp.kind ?? inp.resource;
    const ia = +(inp.amount ?? inp.quantity ?? 0);
    matCPU  += (ia / outAmt) * (marketMap[+ik] || 0);
  }

  const makeCPU   = wageCPU + matCPU;
  const buyCPU    = marketMap[+kindId] || 0;
  const makeTotal = makeCPU * deficitPerDay;
  const buyTotal  = buyCPU  * deficitPerDay;

  return {
    makeCPU, buyCPU, makeTotal, buyTotal, wageCPU, matCPU,
    saving: Math.abs(makeTotal - buyTotal),
    deficitPerDay,
    bldName: enc.name || 'Building',
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   SORT
───────────────────────────────────────────────────────────────────────────── */
function applySort(tbl, col, dir) {
  sortSt[tbl] = { col, dir };
  doSort(tbl);
  if (tbl === 's') renderSurplus(); else renderDeficit();

  const prefix = tbl === 's' ? 'ss' : 'ds';
  document.querySelectorAll(`[id^="${prefix}-"]`).forEach(b => b.classList.remove('active'));
  const colMap = tbl === 's'
    ? { net: 'net', name: 'name', produced: 'produced', mv: 'val' }
    : { net: 'net', name: 'name', buyCost: 'buy' };
  document.getElementById(`${prefix}-${colMap[col] || col}`)?.classList.add('active');
}
function doSort(tbl) {
  const { col, dir } = sortSt[tbl];
  const rows = tbl === 's' ? surRows : defRows;
  rows.sort((a, b) => {
    const av = a[col], bv = b[col];
    if (typeof av === 'string') return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return dir === 'asc' ? (av - bv) : (bv - av);
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   RENDER — SURPLUS
───────────────────────────────────────────────────────────────────────────── */
function renderSurplus() {
  const card = document.getElementById('surCard');
  document.getElementById('surCount').textContent = surRows.length;
  if (!surRows.length) { card.style.display = 'none'; return; }
  card.style.display = 'block';

  document.getElementById('surTbody').innerHTML = surRows.map(r => `
    <tr>
      <td><div class="res">${iconHtml(r)}${esc(r.name)}</div></td>
      <td class="num">${fmtN(r.produced)}</td>
      <td class="num">${fmtN(r.consumed)}</td>
      <td class="num" style="color:var(--green)">+${fmtN(r.net)}</td>
      <td class="num" style="color:var(--gold)">${fmtSC(r.mv)} SC</td>
    </tr>`).join('');
}

/* ─────────────────────────────────────────────────────────────────────────────
   RENDER — DEFICIT
───────────────────────────────────────────────────────────────────────────── */
function renderDeficit() {
  const card = document.getElementById('defCard');
  document.getElementById('defCount').textContent = defRows.length;
  if (!defRows.length) { card.style.display = 'none'; return; }
  card.style.display = 'block';

  document.getElementById('defTbody').innerHTML = defRows.map((r, i) => {
    const chipHtml = r.mvb
      ? `<span class="chip chip-${r.rec}">${r.rec === 'buy' ? '🛒 Buy' : '⚒ Make'} — save ${fmtSC(r.mvb.saving)} SC/day</span>`
      : `<span style="color:var(--muted);font-size:11px">—</span>`;

    return `
    <tr class="def-row" data-idx="${i}" style="cursor:pointer">
      <td><span class="tog" id="tog${i}">&#9658;</span></td>
      <td><div class="res">${iconHtml(r)}${esc(r.name)}</div></td>
      <td class="num">${r.produced > 0.001 ? fmtN(r.produced) : '—'}</td>
      <td class="num">${fmtN(r.consumed)}</td>
      <td class="num" style="color:var(--amber)">${fmtN(r.net)}</td>
      <td class="num">${fmtSC(r.buyCost)} SC/day</td>
      <td>${chipHtml}</td>
    </tr>
    <tr class="detail-tr hide" id="det${i}">
      <td colspan="7">${mvbDetail(r)}</td>
    </tr>`;
  }).join('');
}

function mvbDetail(r) {
  const m = r.mvb;
  if (!m) return `<div class="detail-inner"><p style="color:var(--muted);font-size:13px">No producer building found in the encyclopedia for this resource.</p></div>`;

  const buyWins = m.buyTotal <= m.makeTotal;

  return `<div class="detail-inner">
    <div class="mvb-grid">
      <div class="mvb-box ${buyWins ? 'win' : ''}">
        <div class="mvb-lbl">${buyWins ? '&#10003; ' : ''}Buy from Market</div>
        <div class="mvb-cost">${fmtSC(m.buyTotal)} SC/day</div>
        <div class="mvb-break">
          ${fmtSC(m.buyCPU)} SC/unit &times; ${fmtN(m.deficitPerDay)} units/day
        </div>
      </div>
      <div class="mvb-box ${!buyWins ? 'win2' : ''}">
        <div class="mvb-lbl">${!buyWins ? '&#10003; ' : ''}Produce in ${esc(m.bldName)}</div>
        <div class="mvb-cost">${fmtSC(m.makeTotal)} SC/day</div>
        <div class="mvb-break">
          ${fmtSC(m.makeCPU)} SC/unit total<br>
          Wages: ${fmtSC(m.wageCPU)} SC/unit<br>
          Materials: ${fmtSC(m.matCPU)} SC/unit
        </div>
        ${!buyWins ? `<div class="ao-warn">&#9888; Adding a ${esc(m.bldName)} increases admin overhead</div>` : ''}
      </div>
      <div class="mvb-box">
        <div class="mvb-lbl">Daily Saving</div>
        <div class="mvb-cost" style="color:${buyWins ? 'var(--green)' : 'var(--amber)'}">
          ${fmtSC(m.saving)} SC/day
        </div>
        <div class="mvb-break">
          ${buyWins ? 'Buying is cheaper at any volume' : 'Producing is cheaper at any volume'}
        </div>
      </div>
    </div>
    <div class="detail-note">
      Deficit: ${fmtN(m.deficitPerDay)}/day &nbsp;&middot;&nbsp;
      Market: ${fmtSC(m.buyCPU)} SC/unit &nbsp;&middot;&nbsp;
      Make cost: ${fmtSC(m.makeCPU)} SC/unit
    </div>
  </div>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   EVENT DELEGATION — deficit rows
───────────────────────────────────────────────────────────────────────────── */
document.getElementById('defTbody').addEventListener('click', e => {
  const row = e.target.closest('.def-row');
  if (!row) return;
  const i   = row.dataset.idx;
  const det = document.getElementById('det' + i);
  const tog = document.getElementById('tog' + i);
  det.classList.toggle('hide');
  tog.classList.toggle('open', !det.classList.contains('hide'));
});

/* ─────────────────────────────────────────────────────────────────────────────
   SORT BUTTONS  (data-sort / data-tbl / data-col / data-dir)
───────────────────────────────────────────────────────────────────────────── */
document.querySelectorAll('[data-sort]').forEach(btn => {
  btn.addEventListener('click', () => applySort(btn.dataset.tbl, btn.dataset.col, btn.dataset.dir));
});

document.querySelectorAll('th[data-sort-tbl]').forEach(th => {
  th.addEventListener('click', () => {
    const tbl = th.dataset.sortTbl;
    const col = th.dataset.sortCol;
    const dir = (sortSt[tbl].col === col && sortSt[tbl].dir === 'asc') ? 'desc' : 'asc';
    applySort(tbl, col, dir);
  });
});

/* ─────────────────────────────────────────────────────────────────────────────
   REFRESH BUTTON
───────────────────────────────────────────────────────────────────────────── */
document.getElementById('refreshBtn').addEventListener('click', () => loadAll(true));

/* ─────────────────────────────────────────────────────────────────────────────
   FORMAT HELPERS
───────────────────────────────────────────────────────────────────────────── */
function fmtN(n, dp = 1) {
  if (n == null || isNaN(n)) return '—';
  const a = Math.abs(n);
  if (a >= 1e6) return (n / 1e6).toFixed(dp) + 'M';
  if (a >= 1e3) return (n / 1e3).toFixed(dp) + 'k';
  return n.toFixed(dp);
}
function fmtSC(n) {
  if (n == null || isNaN(n)) return '—';
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (a >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (a >= 1e3) return (n / 1e3).toFixed(1) + 'k';
  return n.toFixed(2);
}
function fmtAO(raw) {
  if (raw == null || raw === 0) return '0%';
  if (raw > 1 && raw < 4) return ((raw - 1) * 100).toFixed(1) + '%';
  if (raw > 0 && raw < 1)  return (raw * 100).toFixed(1) + '%';
  return raw.toFixed(1) + '%';
}
function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function arr(x) {
  if (Array.isArray(x)) return x;
  if (x && typeof x === 'object') return Object.values(x);
  return [];
}
function iconHtml(r) {
  return r.image
    ? `<div class="ricon"><img src="${BASE}${r.image}" loading="lazy" alt="" onerror="this.parentNode.style.display='none'"></div>`
    : `<div class="ricon"></div>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   BOOT
───────────────────────────────────────────────────────────────────────────── */
loadAll();
