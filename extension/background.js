'use strict';

// Respond to cookie requests from the content script.
// The cookies permission + host_permissions gives us access to HttpOnly cookies
// that are invisible to normal JavaScript on the page.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'SC_GET_COOKIE') return;

  chrome.cookies.getAll({ url: 'https://www.simcompanies.com' }, (cookies) => {
    if (!cookies || cookies.length === 0) {
      sendResponse({ ok: false, error: 'No SimCompanies cookies found. Make sure you\'re logged in at simcompanies.com first.' });
      return;
    }
    // Build the same cookie: header string the browser would send
    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    sendResponse({ ok: true, cookie: cookieStr });
  });

  return true; // Keep the message channel open for the async response
});
