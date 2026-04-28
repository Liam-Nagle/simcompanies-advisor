'use strict';

const dot        = document.getElementById('dot');
const statusText = document.getElementById('statusText');
const syncBtn    = document.getElementById('syncBtn');

function setStatus(type, text) {
  dot.className = 'dot ' + (type === 'ok' ? 'dot-g' : type === 'err' ? 'dot-r' : 'dot-y');
  statusText.textContent = text;
}

// Collect cookies from both root and www domains and merge them
function getAllSimCookies() {
  return new Promise((resolve) => {
    Promise.all([
      new Promise(r => chrome.cookies.getAll({ url: 'https://www.simcompanies.com' }, r)),
      new Promise(r => chrome.cookies.getAll({ url: 'https://simcompanies.com' },     r)),
    ]).then(([www, root]) => {
      const seen   = new Set();
      const merged = [...www, ...root].filter(c => !seen.has(c.name) && seen.add(c.name));
      resolve(merged);
    });
  });
}

// Check login status on popup open
getAllSimCookies().then(cookies => {
  if (!cookies || cookies.length === 0) {
    setStatus('err', 'Not logged in to SimCompanies');
    syncBtn.disabled = true;
  } else {
    const hasSession = cookies.some(c => c.name === 'sessionid');
    if (hasSession) {
      setStatus('ok', `Logged in — ${cookies.length} cookies found`);
    } else {
      setStatus('warn', `${cookies.length} cookies found but no sessionid — try logging in again`);
    }
  }
});

// Manual push button
syncBtn.addEventListener('click', () => {
  getAllSimCookies().then(cookies => {
    if (!cookies?.length) { setStatus('err', 'No cookies found'); return; }
    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    chrome.tabs.query({}, (tabs) => {
      const advisorTabs = tabs.filter(t =>
        t.url?.includes('liam-nagle.github.io/simcompanies-advisor') ||
        t.url?.includes('simcompanies-advisor.onrender.com') ||
        t.url?.includes('localhost')
      );
      if (!advisorTabs.length) {
        setStatus('err', 'No Advisor tab open');
        return;
      }

      let pushed = 0;
      let remaining = advisorTabs.length;

      for (const tab of advisorTabs) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (cookie) => {
            window.postMessage({ type: 'SC_AUTO_COOKIE', cookie }, '*');
          },
          args: [cookieStr],
        }, (results) => {
          if (!chrome.runtime.lastError && results?.length) pushed++;
          remaining--;
          if (remaining === 0) {
            if (pushed === 0) {
              setStatus('err', 'Could not inject into Advisor tab — try reloading it');
            } else {
              setStatus('ok', 'Cookie pushed!');
              setTimeout(() => window.close(), 800);
            }
          }
        });
      }
    });
  });
});
