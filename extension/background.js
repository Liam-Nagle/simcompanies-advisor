'use strict';

// Collect all SimCompanies cookies across every cookie store Chrome has,
// regardless of domain variant (simcompanies.com / .simcompanies.com / www.).
function getAllSimCookies() {
  return new Promise((resolve) => {
    chrome.cookies.getAllCookieStores((stores) => {
      const storeIds = (stores || []).map(s => s.id);
      if (!storeIds.length) storeIds.push('0'); // fallback to default store

      Promise.all(
        storeIds.map(storeId =>
          new Promise(r => chrome.cookies.getAll({ storeId }, r))
        )
      ).then(results => {
        const all = results.flat().filter(c =>
          c.domain.includes('simcompanies.com')
        );
        // Deduplicate by name, keeping first occurrence
        const seen   = new Set();
        const merged = all.filter(c => !seen.has(c.name) && seen.add(c.name));
        console.log('[SC Connector] found', merged.length, 'SimCompanies cookies:',
          merged.map(c => `${c.name}(${c.domain})`).join(', '));
        resolve(merged);
      });
    });
  });
}

// Respond to cookie requests from the content script.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'SC_GET_COOKIE') return;

  getAllSimCookies().then(cookies => {
    if (!cookies || cookies.length === 0) {
      sendResponse({ ok: false, error: 'No SimCompanies cookies found. Make sure you\'re logged in at simcompanies.com.' });
      return;
    }
    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    sendResponse({ ok: true, cookie: cookieStr });
  });

  return true;
});
