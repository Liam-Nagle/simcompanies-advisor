'use strict';

// ── Intercept outgoing SimCompanies requests to capture the real Cookie header ──
// chrome.cookies.getAll() doesn't reliably return HttpOnly cookies in MV3.
// webRequest.onSendHeaders sees the actual header Chrome is about to send,
// which includes every cookie (HttpOnly, SameSite=Lax, etc.).
chrome.webRequest.onSendHeaders.addListener(
  (details) => {
    const cookieHeader = details.requestHeaders?.find(
      h => h.name.toLowerCase() === 'cookie'
    );
    if (cookieHeader?.value && cookieHeader.value.includes('sessionid')) {
      chrome.storage.local.set({ capturedCookie: cookieHeader.value });
      console.log('[SC Connector] Cookie captured via webRequest, length:', cookieHeader.value.length);
    }
  },
  { urls: ['https://www.simcompanies.com/*', 'https://simcompanies.com/*'] },
  ['requestHeaders', 'extraHeaders']
);

// ── Respond to cookie requests from the content script ──────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'SC_GET_COOKIE') return;

  // Try the intercepted cookie first (most reliable)
  chrome.storage.local.get('capturedCookie', (result) => {
    if (result.capturedCookie) {
      console.log('[SC Connector] Returning captured cookie, length:', result.capturedCookie.length);
      sendResponse({ ok: true, cookie: result.capturedCookie });
      return;
    }

    // Fallback: cookies API (may only return non-HttpOnly cookies)
    chrome.cookies.getAll({ url: 'https://www.simcompanies.com' }, (cookies) => {
      if (!cookies?.length) {
        sendResponse({ ok: false, error: 'No SimCompanies cookies found. Open simcompanies.com and make sure you\'re logged in.' });
        return;
      }
      const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      sendResponse({ ok: true, cookie: cookieStr });
    });
  });

  return true; // Keep channel open for async response
});
