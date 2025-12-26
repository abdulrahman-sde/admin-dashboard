# Session & Visit Flow — Quick Reference

A short, practical guide you can drop into your repo. Covers which cookies are server/client-set, the simple lifecycle (start → page view → ping → login → end), example headers/snippets, and metrics queries.

---

## One-line summary

- Server sets `session_id` as an HttpOnly cookie for secure session lookup.
- Client sets `visitor_id` (long-lived) and `last_activity` (helper) in JavaScript for analytics and heuristics.

## Cookies (who sets & why)

- `session_id` (server-set)

  - Purpose: identify current visit / server session.
  - Set by server with `Set-Cookie`, use `HttpOnly; Secure; SameSite=Lax`.
  - Short TTL (e.g., 1800 seconds = 30 minutes).

- `visitor_id` (client-set)

  - Purpose: persistent anonymous identifier for unique visitors.
  - Set in JS after consent. Long TTL (e.g., 1 year).

- `last_activity` (client-set helper)
  - Purpose: quick client-side check for session expiry (ms timestamp).
  - Updated on user interactions. Server is authoritative for session expiry.

## Example headers / JS

Server `Set-Cookie` example (on session start):

```
Set-Cookie: session_id=s_abcd1234; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=1800
```

Client JS to create `visitor_id` (after consent):

```js
if (!getCookie("visitor_id")) {
  const id = "v_" + crypto.randomUUID();
  document.cookie = `visitor_id=${id}; Max-Age=${
    60 * 60 * 24 * 365
  }; Path=/; Secure; SameSite=Lax`;
}
```

Client JS to set `last_activity`:

```js
document.cookie = `last_activity=${Date.now()}; Max-Age=3600; Path=/; Secure; SameSite=Lax`;
```

## Simple flow (step-by-step)

1. App loads → client checks `visitor_id`. If missing, create it (after consent).
2. If no `session_id` cookie or `last_activity` > 30 min, call `POST /api/session/start` (body: `{ visitor_id }`). Server:
   - Creates session record, sets HttpOnly `session_id`, returns OK.
3. On each page load / route change send `POST /api/telemetry/page_view` with `{ url, visitor_id, ... }`. Browser includes `session_id` cookie automatically; server updates `sessions.last_activity` and stores page view.
4. On user activity (click/scroll/keydown) update `last_activity` cookie and call a debounced `POST /api/session/ping` to extend server TTL.
5. On login: server authenticates, rotates `session_id` (new HttpOnly cookie), links session to `user_id` and merges analytics history.
6. Session expires when server-side `last_activity` > TTL (e.g., Redis EXPIRE). Next request starts a new session.

## Minimal endpoints (implementation-ready)

- `POST /api/session/start` — body `{ visitor_id }` → server creates session, sets `session_id` cookie.
- `POST /api/telemetry/page_view` — body `{ visitor_id, url, referrer, device }` → server records page view, updates session last_activity.
- `POST /api/session/ping` — body `{}` (cookie identifies session) → server updates last_activity and extends TTL.
- `POST /api/session/end` — optional; server clears cookie and marks `ended_at`.
- `POST /api/auth/login` — on success server rotates session and links `user_id`.

## Key metric queries (Postgres style)

- Total visits (sessions):

```
SELECT COUNT(*) FROM sessions WHERE started_at >= $1 AND started_at < $2;
```

- Unique visitors:

```
SELECT COUNT(DISTINCT COALESCE(user_id, visitor_id)) FROM sessions WHERE started_at >= $1 AND started_at < $2;
```

- Conversion rate (orders / sessions):

```
SELECT (COUNT(o.id)::float / GREATEST((SELECT COUNT(*) FROM sessions WHERE started_at >= $1 AND started_at < $2),1)) * 100 AS conversion_rate
FROM orders o WHERE o.created_at >= $1 AND o.created_at < $2;
```

- Average order value (AOV):

```
SELECT AVG(amount) FROM orders WHERE created_at >= $1 AND created_at < $2;
```

## Quick implementation notes

- Prefer server-set `HttpOnly` cookie for `session_id` to prevent XSS theft.
- Store sessions in Redis with TTL for fast active counts; persist page_views/orders to Postgres for reporting.
- Use `navigator.sendBeacon` for unload page views and debounce pings to reduce load.
- Rotate `session_id` on login to prevent session fixation.
- Respect GDPR: don't create `visitor_id` until consent is given (unless you have lawful basis).

## Next steps (suggested)

- Add `src/lib/session.ts` (client init + page view + ping).
- Add server endpoints (Express/Serverless) to set `session_id` HttpOnly cookie and accept telemetry.
- Add `GET /api/metrics/overview` that runs the SQL above and returns JSON for the dashboard.

---

If you want, I can now add a tiny `src/lib/session.ts` file that only handles `visitor_id`, initial page_view, and debounced pings — or I can add the server example. Tell me which file to create next and I will add it.
