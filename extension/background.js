'use strict';

// Collect all SimCompanies cookies regardless of whether they're set on
// simcompanies.com or www.simcompanies.com (sessionid lives on the root domain).
function getAllSimCookies() {
  return new Promise((resolve) => {
    Promise.all([
      new Promise(r => chrome.cookies.getAll({ url: 'https://www.simcompanies.com' }, r)),
      new Promise(r => chrome.cookies.getAll({ url: 'https://simcompanies.com' },     r)),
    ]).then(([www, root]) => {
      // Merge, keeping the first occurrence of each cookie name (www takes priority)
      const seen = new Set();
      const merged = [...www, ...root].filter(c => !seen.has(c.name) && seen.add(c.name));
      resolve(merged);
    });
  });
}

// Respond to cookie requests from the content script.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'SC_GET_COOKIE') return;

  getAllSimCookies().then(cookies => {
    if (!cookies || cookies.length === 0) {
      sendResponse({ ok: false, error: 'No SimCompanies cookies found. Make sure you\'re logged in at simcompanies.com first.' });
      return;
    }
    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    console.log('[SC Connector] sending', cookies.length, 'cookies, names:', cookies.map(c => c.name).join(', '));
    sendResponse({ ok: true, cookie: cookieStr });
  });

  return true; // Keep the message channel open for the async response
});
