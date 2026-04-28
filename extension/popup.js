'use strict';

const dot        = document.getElementById('dot');
const statusText = document.getElementById('statusText');
const syncBtn    = document.getElementById('syncBtn');

function setStatus(type, text) {
  dot.className = 'dot ' + (type === 'ok' ? 'dot-g' : type === 'err' ? 'dot-r' : 'dot-y');
  statusText.textContent = text;
}

// Check if cookies are available
chrome.cookies.getAll({ domain: 'simcompanies.com' }, (cookies) => {
  if (!cookies || cookies.length === 0) {
    setStatus('err', 'Not logged in to SimCompanies');
    syncBtn.disabled = true;
  } else {
    setStatus('ok', `Logged in — ${cookies.length} cookies found`);
  }
});

// Manual push button — injects the cookie into any open Advisor tab
syncBtn.addEventListener('click', () => {
  chrome.cookies.getAll({ domain: 'simcompanies.com' }, (cookies) => {
    if (!cookies?.length) { setStatus('err', 'No cookies found'); return; }
    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    // Find an open Advisor tab and post the cookie to it
    chrome.tabs.query({}, (tabs) => {
      const advisorTabs = tabs.filter(t =>
        t.url?.includes('simcompanies-advisor.onrender.com') ||
        t.url?.includes('localhost')
      );
      if (!advisorTabs.length) {
        setStatus('err', 'No Advisor tab open');
        return;
      }
      for (const tab of advisorTabs) {
        chrome.tabs.sendMessage(tab.id, { type: 'SC_PUSH_COOKIE', cookie: cookieStr });
      }
      setStatus('ok', 'Cookie pushed!');
      setTimeout(() => window.close(), 800);
    });
  });
});
