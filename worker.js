/**
 * SimCompanies Advisor — Cloudflare Worker proxy
 *
 * Drop-in replacement for server.js (Express) with zero cold starts.
 * Deploy via the Cloudflare dashboard (Workers & Pages → Create Worker → paste this).
 * Free tier: 100,000 requests/day, permanently free, no sleep.
 */

export default {
  async fetch(request) {
    const url    = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';

    // CORS headers applied to every response
    const cors = {
      'Access-Control-Allow-Origin':  origin,
      'Access-Control-Allow-Headers': 'X-Sim-Cookie',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Vary': 'Origin',
    };

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // ── Health check ─────────────────────────────────────────────────────────
    if (url.pathname === '/healthz' || url.pathname === '/ping') {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // ── API proxy ─────────────────────────────────────────────────────────────
    if (url.pathname.startsWith('/api/')) {
      const target = `https://www.simcompanies.com${url.pathname}${url.search}`;

      let upstream;
      try {
        upstream = await fetch(target, {
          redirect: 'manual',
          headers: {
            'Cookie':           request.headers.get('X-Sim-Cookie') || '',
            'Accept':           'application/json, text/plain, */*',
            'Origin':           'https://www.simcompanies.com',
            'Referer':          'https://www.simcompanies.com/',
            'User-Agent':       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            'Accept-Language':  'en-US,en;q=0.9',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ error: 'proxy_error', message: err.message }),
          { status: 502, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      // SimCompanies redirects to login when the session is invalid
      if (upstream.status >= 300 && upstream.status < 400) {
        return new Response(
          JSON.stringify({ error: 'auth_required', message: 'Session invalid or expired — please re-sync your cookie.' }),
          { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } }
        );
      }

      const body = await upstream.text();
      return new Response(body, {
        status: upstream.status,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not found', { status: 404, headers: cors });
  },
};
