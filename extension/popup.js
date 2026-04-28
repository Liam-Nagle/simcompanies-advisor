'use strict';

const dot        = document.getElementById('dot');
const statusText = document.getElementById('statusText');
const syncBtn    = document.getElementById('syncBtn');

function setStatus(type, text) {
  dot.className = 'dot ' + (type === 'ok' ? 'dot-g' : type === 'err' ? 'dot-r' : 'dot-y');
  statusText.textContent = text;
}

// Check if cookies are available
chrome.cookies.getAll({ url: 'https://www.simcompanies.com' }, (cookies) => {
  if (!cookies || cookies.length === 0) {
    setStatus('err', 'Not logged in to SimCompanies');
    syncBtn.disabled = true;
  } else {
    setStatus('ok', `Logged in — ${cookies.length} cookies found`);
  }
});

// Manual push button — injects the cookie into any open Advisor tab
syncBtn.addEventListener('click', () => {
  chrome.cookies.getAll({ url: 'https://www.simcompanies.com' }, (cookies) => {
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
        // Use executeScript to directly post the message into the page.
        // This works even if the content script hasn't been injected yet
        // (e.g. tab was open before the extension was loaded).
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
