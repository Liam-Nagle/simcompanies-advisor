import express from 'express';

const PORT = process.env.PORT || 3000;
const app  = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// Reflect any origin — the session cookie is supplied by the client per-request,
// there is no server-side secret to protect.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',  req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Sim-Cookie');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── Health check ──────────────────────────────────────────────────────────────
// Lightweight wake-up endpoint — no proxying, just confirms the server is alive.
app.get('/ping', (req, res) => res.json({ ok: true }));

// ── Proxy ─────────────────────────────────────────────────────────────────────
// Forward every /api/* path to simcompanies.com, injecting the caller's
// session cookie from the X-Sim-Cookie request header.
app.get('/api/*', async (req, res) => {
  const qs  = new URLSearchParams(req.query).toString();
  const url = `https://www.simcompanies.com${req.path}${qs ? '?' + qs : ''}`;

  try {
    const upstream = await fetch(url, {
      redirect: 'manual',   // don't follow redirects — a 3xx means SimCompanies wants a login
      headers: {
        Cookie:             req.headers['x-sim-cookie'] || '',
        Accept:             'application/json, text/plain, */*',
        Origin:             'https://www.simcompanies.com',
        Referer:            'https://www.simcompanies.com/',
        'User-Agent':       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept-Language':  'en-US,en;q=0.9',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    // SimCompanies redirects to the login page when the session is invalid.
    // Treat any redirect as an auth failure so the client gets a clean 401.
    if (upstream.status >= 300 && upstream.status < 400) {
      return res.status(401).json({ error: 'auth_required', message: 'Session invalid or expired — please re-sync your cookie.' });
    }

    const body = await upstream.text();
    res.status(upstream.status).type('json').send(body);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(502).json({ error: 'proxy_error', message: err.message });
  }
});

app.listen(PORT, () => console.log(`SimCompanies proxy listening on :${PORT}`));
