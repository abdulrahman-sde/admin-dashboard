# Session Management Implementation Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Data Flow](#data-flow)
5. [Implementation Details](#implementation-details)
6. [Testing Strategy](#testing-strategy)
7. [Security Considerations](#security-considerations)

---

## Overview

This document outlines the complete session management system for the e-commerce dashboard backend, designed to track both anonymous visitors and authenticated customers across their shopping journey.

### Goals

- Track visitor behavior from first visit to conversion
- Support both anonymous and authenticated sessions
- Enable real-time analytics and reporting
- Maintain session state across multiple requests
- Scale efficiently with Redis caching

---

## Architecture

### High-Level Components

```
┌─────────────┐
│   Client    │
│ (Frontend)  │
└──────┬──────┘
       │
       │ HTTP + Cookies
       │
┌──────▼──────────────────────────────────────┐
│         Express Middleware Layer            │
│  ┌────────────────────────────────────┐    │
│  │   Session Middleware               │    │
│  │  - Parse cookies                   │    │
│  │  - Validate session                │    │
│  │  - Attach to req.session           │    │
│  └────────────────────────────────────┘    │
└──────┬──────────────────────────────────────┘
       │
       ├─────────────┬──────────────┐
       │             │              │
┌──────▼──────┐ ┌───▼────┐  ┌──────▼────────┐
│   Redis     │ │ Service│  │   MongoDB     │
│  (Cache)    │ │ Layer  │  │ (Persistent)  │
│             │ │        │  │               │
│ Active      │ │Session │  │ Session       │
│ Sessions    │ │Event   │  │ SessionEvent  │
│ TTL: 30min  │ │Tracking│  │ DailyMetrics  │
└─────────────┘ └────────┘  └───────────────┘
```

### Data Storage Strategy

**Redis (Hot Data - Fast Access)**

- Active sessions (TTL: 30 minutes)
- Quick lookups for every request
- Auto-expiration of inactive sessions

**MongoDB (Cold Data - Analytics)**

- Historical session data
- Event tracking
- Aggregated metrics

---

## Technology Stack

### Dependencies

```json
{
  "@upstash/redis": "^1.28.0",
  "cookie-parser": "^1.4.6",
  "uuid": "^9.0.1"
}
```

### Why Upstash Redis?

| Feature            | Benefit                      |
| ------------------ | ---------------------------- |
| HTTP-based         | No connection pooling needed |
| Serverless-ready   | Perfect for auto-scaling     |
| Global replication | Low latency worldwide        |
| Auto-scaling       | Handles traffic spikes       |
| No infrastructure  | Managed service              |

**Trade-off**: Slightly higher latency (~10-20ms) vs traditional Redis due to HTTP overhead, but easier setup and better for serverless.

---

## Data Flow

### 1. Anonymous Visitor Flow

```
┌──────────┐
│  Client  │
│ (First   │
│  Visit)  │
└────┬─────┘
     │
     │ GET /api/storefront/products
     │ No cookies sent
     │
┌────▼──────────────────────────────────┐
│  Middleware: checkSession()           │
│                                       │
│  1. Parse cookies → None found        │
│  2. Generate visitor_id (UUID)        │
│  3. Generate session_id (UUID)        │
│  4. Create session in MongoDB         │
│  5. Cache session in Redis (TTL)      │
│  6. Set response cookies              │
└────┬──────────────────────────────────┘
     │
     │ Response Headers:
     │ Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Max-Age=1800
     │ Set-Cookie: visitor_id=xyz789; Max-Age=31536000
     │
┌────▼─────┐
│  Client  │
│  Stores  │
│  Cookies │
└──────────┘
```

**Subsequent Requests:**

```
Client → GET /api/storefront/products/123
         Cookie: session=abc123; visitor_id=xyz789

Middleware:
  1. Parse cookies ✓
  2. Look up session in Redis
     - Found? → Extend TTL, update lastSeenAt
     - Not found? → Load from MongoDB or expired
  3. Attach to req.session
  4. Track page_view event
  5. Continue to controller
```

---

### 2. Customer Login Flow (Session Conversion)

```
┌──────────────────────────────────────┐
│  Anonymous Session Exists            │
│  session_id: abc123                  │
│  visitor_id: xyz789                  │
│  type: ANONYMOUS                     │
└────┬─────────────────────────────────┘
     │
     │ POST /api/storefront/auth/login
     │ Body: { email, password }
     │ Cookie: session=abc123
     │
┌────▼──────────────────────────────────┐
│  Auth Controller                      │
│  1. Validate credentials ✓            │
│  2. Get current session from req      │
│  3. Convert session:                  │
│     - type: ANONYMOUS → CUSTOMER      │
│     - customerId: null → customerId   │
│  4. Update Redis + MongoDB            │
│  5. Track login event                 │
└────┬──────────────────────────────────┘
     │
     │ Same session_id, now authenticated
     │
┌────▼─────────────────────────────────┐
│  Customer Session                    │
│  session_id: abc123 (same)           │
│  visitor_id: xyz789 (same)           │
│  customerId: customer_id_001 (new)   │
│  type: CUSTOMER                      │
└──────────────────────────────────────┘
```

**Why same session_id?**

- Maintains complete journey tracking (anonymous → customer)
- Preserves cart, browsing history, UTM tracking
- Enables attribution analysis

---

### 3. Order Creation & Conversion

```
┌──────────────────────────────────────┐
│  Customer browses, adds to cart      │
│  Multiple page_view events tracked   │
│  add_to_cart events tracked          │
└────┬─────────────────────────────────┘
     │
     │ POST /api/storefront/orders
     │ Cookie: session=abc123
     │
┌────▼──────────────────────────────────┐
│  Order Service                        │
│  1. Create order                      │
│  2. Get session from req.session      │
│  3. Mark session as converted:        │
│     - converted: true                 │
│     - orderId: order_id_001           │
│  4. Update Redis + MongoDB            │
│  5. Track order_completed event       │
│  6. Update customer analytics         │
└────┬──────────────────────────────────┘
     │
     │
┌────▼─────────────────────────────────┐
│  Converted Session                   │
│  converted: true                     │
│  orderId: order_id_001               │
│  Journey: visit → browse → login →   │
│           add_cart → checkout → buy  │
└──────────────────────────────────────┘
```

---

### 4. Session Expiration & Cleanup

**Redis TTL Management:**

```
Every Request:
  ┌─────────────────────────────────┐
  │ Update lastSeenAt               │
  │ Extend Redis TTL (30 min)       │
  │                                 │
  │ If inactive for 30 minutes:     │
  │   → Redis auto-deletes          │
  │   → MongoDB session remains     │
  └─────────────────────────────────┘

MongoDB Cleanup (Daily Cron):
  ┌─────────────────────────────────┐
  │ Find sessions where:            │
  │   lastSeenAt > 24 hours ago     │
  │                                 │
  │ Archive or mark as expired      │
  └─────────────────────────────────┘
```

---

## Implementation Details

### 1. Redis Client Setup

**File: `src/lib/redis.ts`**

```typescript
import { Redis } from "@upstash/redis";

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error("Upstash Redis credentials not found");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Key prefixes
export const REDIS_KEYS = {
  session: (sessionId: string) => `session:${sessionId}`,
  visitor: (visitorId: string) => `visitor:${visitorId}`,
  activeUsers: "metrics:active_users",
};

// TTL constants (in seconds)
export const REDIS_TTL = {
  SESSION: 30 * 60, // 30 minutes
  VISITOR: 365 * 24 * 60 * 60, // 1 year
  METRICS: 60, // 1 minute
};
```

### 2. Session Types

**File: `src/types/session.types.ts`**

```typescript
import { SessionType } from "@prisma/client";

export interface SessionData {
  sessionId: string;
  visitorId: string;
  customerId?: string;
  type: SessionType;

  // Request metadata
  ipAddress: string;
  userAgent: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;

  // UTM tracking
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;

  // Activity
  pageViews: number;
  lastSeenAt: Date;
  startedAt: Date;

  // Conversion
  converted: boolean;
  orderId?: string;
}

export interface RedisSessionData {
  sessionId: string;
  visitorId: string;
  customerId?: string;
  type: SessionType;
  ipAddress: string;
  pageViews: number;
  lastSeenAt: string; // ISO string
  converted: boolean;
  orderId?: string;
}

export interface CreateSessionInput {
  visitorId?: string; // From client cookie (optional hint)
  ipAddress: string;
  userAgent: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface TrackEventInput {
  sessionId: string;
  eventType: string;
  page?: string;
  productId?: string;
  metadata?: Record<string, any>;
}
```

### 3. Session Middleware

**File: `src/middleware/session.middleware.ts`**

```typescript
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { sessionService } from "../services/session.service";

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      session?: SessionData;
      visitorId?: string;
    }
  }
}

export const sessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Parse cookies
    const sessionId = req.cookies?.session;
    const visitorIdFromCookie = req.cookies?.visitor_id;

    let session: SessionData | null = null;

    // 2. Try to resume existing session
    if (sessionId) {
      session = await sessionService.getSession(sessionId);

      // Extend TTL if session is still active
      if (session) {
        await sessionService.extendSession(sessionId);
      }
    }

    // 3. Create new session if none exists or expired
    if (!session) {
      const newSessionData = await sessionService.createSession({
        visitorId: visitorIdFromCookie,
        ipAddress: req.ip || req.socket.remoteAddress || "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
        landingPage: req.originalUrl,
        referrer: req.headers["referer"],
        utmSource: req.query.utm_source as string,
        utmMedium: req.query.utm_medium as string,
        utmCampaign: req.query.utm_campaign as string,
      });

      session = newSessionData;

      // Set cookies
      res.cookie("session", session.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 60 * 1000, // 30 minutes
        signed: true,
      });

      res.cookie("visitor_id", session.visitorId, {
        httpOnly: false, // Client can read this
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      });
    }

    // 4. Attach session to request
    req.session = session;
    req.visitorId = session.visitorId;

    // 5. Track page view (async, don't wait)
    sessionService
      .trackEvent({
        sessionId: session.sessionId,
        eventType: "page_view",
        page: req.originalUrl,
      })
      .catch(console.error);

    next();
  } catch (error) {
    console.error("Session middleware error:", error);
    // Don't block request, continue without session
    next();
  }
};

// Optional: Require authenticated session
export const requireCustomerSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session || req.session.type !== "CUSTOMER") {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }
  next();
};
```

### 4. Session Repository

**File: `src/repositories/session.repository.ts`**

```typescript
import { prisma } from "../lib/prisma";
import { redis, REDIS_KEYS, REDIS_TTL } from "../lib/redis";
import {
  SessionData,
  RedisSessionData,
  CreateSessionInput,
  TrackEventInput,
} from "../types/session.types";
import { SessionType } from "@prisma/client";

class SessionRepository {
  // Create new session (both Redis + MongoDB)
  async create(
    data: CreateSessionInput & { sessionId: string; visitorId: string }
  ) {
    // Parse user agent for device/browser info
    const deviceInfo = this.parseUserAgent(data.userAgent);

    // Create in MongoDB
    const session = await prisma.session.create({
      data: {
        sessionId: data.sessionId,
        visitorId: data.visitorId,
        type: SessionType.ANONYMOUS,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        landingPage: data.landingPage,
        referrer: data.referrer,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        ...deviceInfo,
        pageViews: 0,
        startedAt: new Date(),
        lastSeenAt: new Date(),
      },
    });

    // Cache in Redis
    await this.cacheSession(session.sessionId, {
      sessionId: session.sessionId,
      visitorId: session.visitorId,
      type: session.type,
      ipAddress: session.ipAddress,
      pageViews: session.pageViews,
      lastSeenAt: session.lastSeenAt.toISOString(),
      converted: session.converted,
    });

    return this.toSessionData(session);
  }

  // Get session (try Redis first, fallback to MongoDB)
  async findBySessionId(sessionId: string): Promise<SessionData | null> {
    // Try Redis first
    const cached = await redis.get<RedisSessionData>(
      REDIS_KEYS.session(sessionId)
    );
    if (cached) {
      return this.fromRedisData(cached);
    }

    // Fallback to MongoDB
    const session = await prisma.session.findUnique({
      where: { sessionId },
    });

    if (!session) return null;

    // Re-cache if found
    await this.cacheSession(sessionId, {
      sessionId: session.sessionId,
      visitorId: session.visitorId,
      customerId: session.customerId || undefined,
      type: session.type,
      ipAddress: session.ipAddress,
      pageViews: session.pageViews,
      lastSeenAt: session.lastSeenAt.toISOString(),
      converted: session.converted,
      orderId: session.orderId || undefined,
    });

    return this.toSessionData(session);
  }

  // Update session (both Redis + MongoDB)
  async update(sessionId: string, data: Partial<SessionData>) {
    // Update MongoDB
    const session = await prisma.session.update({
      where: { sessionId },
      data: {
        customerId: data.customerId,
        type: data.type,
        pageViews: data.pageViews,
        lastSeenAt: data.lastSeenAt,
        converted: data.converted,
        orderId: data.orderId,
      },
    });

    // Update Redis cache
    const redisData: RedisSessionData = {
      sessionId: session.sessionId,
      visitorId: session.visitorId,
      customerId: session.customerId || undefined,
      type: session.type,
      ipAddress: session.ipAddress,
      pageViews: session.pageViews,
      lastSeenAt: session.lastSeenAt.toISOString(),
      converted: session.converted,
      orderId: session.orderId || undefined,
    };

    await this.cacheSession(sessionId, redisData);

    return this.toSessionData(session);
  }

  // Track event
  async createEvent(data: TrackEventInput) {
    return await prisma.sessionEvent.create({
      data: {
        sessionId: data.sessionId,
        eventType: data.eventType,
        page: data.page,
        productId: data.productId,
        metadata: data.metadata || undefined,
      },
    });
  }

  // Cache in Redis
  private async cacheSession(sessionId: string, data: RedisSessionData) {
    await redis.setex(
      REDIS_KEYS.session(sessionId),
      REDIS_TTL.SESSION,
      JSON.stringify(data)
    );
  }

  // Extend Redis TTL
  async extendTTL(sessionId: string) {
    await redis.expire(REDIS_KEYS.session(sessionId), REDIS_TTL.SESSION);
  }

  // Convert MongoDB to SessionData
  private toSessionData(session: any): SessionData {
    return {
      sessionId: session.sessionId,
      visitorId: session.visitorId,
      customerId: session.customerId || undefined,
      type: session.type,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      country: session.country || undefined,
      city: session.city || undefined,
      device: session.device || undefined,
      browser: session.browser || undefined,
      os: session.os || undefined,
      landingPage: session.landingPage || undefined,
      referrer: session.referrer || undefined,
      utmSource: session.utmSource || undefined,
      utmMedium: session.utmMedium || undefined,
      utmCampaign: session.utmCampaign || undefined,
      pageViews: session.pageViews,
      lastSeenAt: session.lastSeenAt,
      startedAt: session.startedAt,
      converted: session.converted,
      orderId: session.orderId || undefined,
    };
  }

  // Convert Redis to SessionData
  private fromRedisData(data: RedisSessionData): SessionData {
    return {
      sessionId: data.sessionId,
      visitorId: data.visitorId,
      customerId: data.customerId,
      type: data.type,
      ipAddress: data.ipAddress,
      userAgent: "",
      pageViews: data.pageViews,
      lastSeenAt: new Date(data.lastSeenAt),
      startedAt: new Date(data.lastSeenAt), // Approximate
      converted: data.converted,
      orderId: data.orderId,
    };
  }

  // Parse user agent (simplified)
  private parseUserAgent(userAgent: string) {
    const isMobile = /mobile|android|iphone/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);

    return {
      device: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
      browser: this.detectBrowser(userAgent),
      os: this.detectOS(userAgent),
    };
  }

  private detectBrowser(ua: string): string {
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    return "Other";
  }

  private detectOS(ua: string): string {
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iOS")) return "iOS";
    return "Other";
  }
}

export const sessionRepository = new SessionRepository();
```

---

## Testing Strategy

### Postman Testing

**Collection: Session Management Tests**

#### Test 1: Create Anonymous Session

```http
GET http://localhost:3000/api/storefront/products
```

**Expected Response:**

- Status: 200
- Headers include: `Set-Cookie: session=...` and `Set-Cookie: visitor_id=...`

#### Test 2: Resume Session

```http
GET http://localhost:3000/api/storefront/products/123
# Cookies automatically sent by Postman
```

**Verification:**

- Same session_id maintained
- `pageViews` incremented

#### Test 3: Login (Convert Session)

```http
POST http://localhost:3000/api/storefront/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Verification:**

- Session type changed from ANONYMOUS → CUSTOMER
- customerId populated
- Same session_id maintained

#### Test 4: Create Order (Conversion)

```http
POST http://localhost:3000/api/storefront/orders
Content-Type: application/json

{
  "items": [...],
  "shippingAddress": {...}
}
```

**Verification:**

- Session marked as `converted: true`
- `orderId` populated

---

## Security Considerations

### 1. Cookie Configuration

```typescript
{
  httpOnly: true,        // Prevent XSS access
  secure: true,          // HTTPS only in production
  sameSite: 'lax',       // CSRF protection
  signed: true,          // Verify cookie integrity
  maxAge: 1800000        // 30 minutes
}
```

### 2. Rate Limiting

- Limit session creation per IP
- Prevent session fixation attacks
- Detect suspicious visitor patterns

### 3. Data Privacy

- Don't store sensitive data in sessions
- Anonymize IP addresses (GDPR)
- Provide visitor opt-out mechanism

---

## Next Steps

1. **Install dependencies**: `npm install @upstash/redis cookie-parser uuid`
2. **Set up Upstash Redis**: Get credentials from upstash.com
3. **Implement files**: Redis client → Types → Middleware → Repository → Service
4. **Wire middleware**: Add to Express app
5. **Test with Postman**: Verify flow works end-to-end
6. **Add analytics**: Build aggregation for DailyMetrics

---

**Ready to start implementation? Let me know which component to build first!**
