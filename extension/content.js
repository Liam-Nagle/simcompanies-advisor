'use strict';

// This script runs inside SimCompanies Advisor whenever the page loads.
// It asks the background worker for the SimCompanies session cookie and
// posts it to the page — the advisor app picks it up and auto-syncs.

function requestCookie() {
  chrome.runtime.sendMessage({ type: 'SC_GET_COOKIE' }, (response) => {
    if (chrome.runtime.lastError) {
      console.warn('[SC Connector] Extension background error:', chrome.runtime.lastError.message);
      return;
    }
    if (!response?.ok || !response.cookie) {
      console.warn('[SC Connector] No cookie available:', response?.error);
      // Post a "not logged in" signal so the advisor can show an appropriate prompt
      window.postMessage({ type: 'SC_AUTO_COOKIE', cookie: null, error: response?.error }, '*');
      return;
    }
    window.postMessage({ type: 'SC_AUTO_COOKIE', cookie: response.cookie }, '*');
  });
}

// Request immediately on load
requestCookie();

// Re-request if the page asks (e.g. the user wants a manual refresh)
window.addEventListener('message', (event) => {
  if (event.source === window && event.data?.type === 'SC_REQUEST_COOKIE') {
    requestCookie();
  }
});

// Handle manual push from the extension popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SC_PUSH_COOKIE' && message.cookie) {
    window.postMessage({ type: 'SC_AUTO_COOKIE', cookie: message.cookie }, '*');
  }
});
