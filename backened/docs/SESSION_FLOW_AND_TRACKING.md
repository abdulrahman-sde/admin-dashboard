# Production Session & Analytics Architecture

This document details the production-grade implementation of session management and analytics flow, focusing on the differentiation between **Total Visits** (Sessions) and **Unique Visits** (Visitors).

## � Core Concepts

To achieve the dashboard metrics:

- **Total Visits:** Count of unique `sessionId` strings created.
- **Unique Visits:** Count of unique `visitorId` strings (deduplicated).

## 🔄 The Complete Flow: Frontend to Backend

### 1. Frontend: The Initialization (The "Ping")

Since static pages don't inherently talk to the backend, the frontend MUST initiate contact to establish sessions.

**Best Practice:**
Use a global `useEffect` in your main layout (`App.tsx` or `Layout.tsx`) to fire a `page_view` event on every route change.

```javascript
// src/hooks/useAnalytics.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../lib/api"; // Axios instance with withCredentials: true

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // This request triggers the Session Middleware!
    api
      .post("/analytics/track", {
        eventType: "page_view",
        path: location.pathname,
      })
      .catch((err) => console.error("Tracking failed", err));
  }, [location]);
};
```

### 2. Backend: Session Middleware Logic

The middleware acts as the gatekeeper. It identifies users based on cookies and generates IDs if missing.

#### **Step-by-Step Logic**

1.  **Incoming Request:** POST `/api/analytics/track`
2.  **Cookie Check:**

    - `req.cookies.session` (Short-lived, ~30 mins)
    - `req.cookies.visitor_id` (Long-lived, ~1 Year)

3.  **Scenario A: Brand New User (First Visit)**

    - `session` cookie: **MISSING**
    - `visitor_id` cookie: **MISSING**
    - **Action:**
      - Generate `newSessionId` (e.g., "sess_123")
      - Generate `newVisitorId` (e.g., "vis_ABC")
      - Save to DB/Redis (Session linked to Visitor)
      - Set **BOTH** cookies.

4.  **Scenario B: Returning User (Same Session)**

    - `session` cookie: **EXISTS** ("sess_123")
    - `visitor_id` cookie: **EXISTS** ("vis_ABC")
    - **Action:**
      - Validate `sessionId` in Redis.
      - Extend TTL (keep session alive).
      - Proceed.

5.  **Scenario C: Returning User (Next Day / Expired Session)**
    - `session` cookie: **MISSING** (Expired)
    - `visitor_id` cookie: **EXISTS** ("vis_ABC")
    - **Action:**
      - Generate `newSessionId` (e.g., "sess_456")
      - **REUSE** `visitorId` ("vis_ABC") from cookie.
      - Save to DB (New Session "sess_456" -> Linked to "vis_ABC")
      - Set `session` cookie.

### 3. Database: The Data Model

This structure supports your dashboard queries.

**Sessions Table:**
| sessionId | visitorId | created_at |
| :--- | :--- | :--- |
| sess_123 | **vis_ABC** | 2023-10-01 10:00 |
| sess_456 | **vis_ABC** | 2023-10-02 14:00 |
| sess_789 | vis_XYZ | 2023-10-02 14:30 |

### 4. Dashboard Queries (The "Proof")

#### **Metric: Total Visits (Sessions)**

```typescript
const totalVisits = await prisma.session.count({
  where: {
    startedAt: { gte: startOfDay, lte: endOfDay },
  },
});
// Result: 3
```

#### **Metric: Unique Visits (Visitors)**

```typescript
const uniqueVisits = await prisma.session.groupBy({
  by: ["visitorId"],
  where: {
    startedAt: { gte: startOfDay, lte: endOfDay },
  },
  _count: { visitorId: true },
});
const count = uniqueVisits.length;
// Result: 2 (vis_ABC, vis_XYZ)
```

## 🛠 Implementation Checklist

### Frontend

- [ ] Ensure `axios` or `fetch` has `credentials: 'include'` / `withCredentials: true`.
- [ ] Create a `usePageTracking` hook.
- [ ] Call the hook in `App.tsx`.

### Backend (Middleware)

- [ ] Check `req.cookies.visitor_id`.
- [ ] If missing, generate `crypto.randomUUID()`.
- [ ] If present, **reuse it**.
- [ ] Create Session linked to `visitorId`.
- [ ] Set `visitor_id` cookie with `maxAge: 1 year`.

### Backend (Controller)

- [ ] `/analytics/track` endpoint just returns `200 OK` (Middleware does the heavy lifting).

## 🚀 Production Notes

1.  **Cookie Security:** Always use `HttpOnly; Secure; SameSite=Lax`.
2.  **Redis:** Use Redis for active session checks (fast). Use MongoDB for the long-term analytics queries (aggregation).
3.  **Bot Traffic:** Consider filtering User-Agents in middleware to avoid inflating "Unique Visits" with crawlers.
