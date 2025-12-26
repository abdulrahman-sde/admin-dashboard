# Session Middleware - Complete Code Reference

This document contains all the code needed for session management middleware implementation.

---

## 📦 Required Dependencies

Add these to your `package.json`:

```bash
npm install @upstash/redis cookie-parser uuid date-fns node-cron
npm install --save-dev @types/cookie-parser @types/uuid @types/node-cron
```

**Updated package.json dependencies:**

```json
{
  "dependencies": {
    "@upstash/redis": "^1.28.0",
    "cookie-parser": "^1.4.6",
    "uuid": "^9.0.1",
    "date-fns": "^3.0.0",
    "node-cron": "^3.0.3"
  },
  "devDependencies": {
    "@types/cookie-parser": "^1.4.7",
    "@types/uuid": "^9.0.8",
    "@types/node-cron": "^3.0.11"
  }
}
```

---

## 🔧 Environment Variables

**File: `.env`**

```bash
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Cookie Secret (generate with: openssl rand -base64 32)
COOKIE_SECRET=your-super-secret-key-at-least-32-characters-long

# Session Configuration
SESSION_TTL=1800              # 30 minutes in seconds
VISITOR_TTL=31536000          # 1 year in seconds

# Enable Cron Jobs (set to 'true' in production)
ENABLE_CRON=false

# Environment
NODE_ENV=development
```

---

## 📁 File 1: Redis Client

**File: `src/lib/redis.ts`**

```typescript
import { Redis } from "@upstash/redis";

// Validate environment variables
if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error(
    "Missing Upstash Redis credentials. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env"
  );
}

/**
 * Upstash Redis client instance
 * Uses REST API instead of TCP connection (serverless-friendly)
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * Redis key prefixes for different data types
 */
export const REDIS_KEYS = {
  session: (sessionId: string) => `session:${sessionId}`,
  visitor: (visitorId: string) => `visitor:${visitorId}`,
  activeUsers: "metrics:active_users",
  dailyVisits: (date: string) => `metrics:daily_visits:${date}`, // YYYY-MM-DD
};

/**
 * Redis TTL constants (in seconds)
 */
export const REDIS_TTL = {
  SESSION: parseInt(process.env.SESSION_TTL || "1800", 10), // 30 minutes default
  VISITOR: parseInt(process.env.VISITOR_TTL || "31536000", 10), // 1 year default
  METRICS: 60, // 1 minute
  DAILY_METRICS: 7 * 24 * 60 * 60, // 7 days
};

/**
 * Test Redis connection
 */
export async function testRedisConnection(): Promise<boolean> {
  try {
    const result = await redis.ping();
    console.log("✅ Redis connection successful:", result);
    return true;
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
    return false;
  }
}
```

---

## 📁 File 2: Session Types

**File: `src/types/session.types.ts`**

```typescript
import { SessionType } from "@prisma/client";

/**
 * Complete session data structure
 */
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

/**
 * Redis session data (lightweight, cached)
 */
export interface RedisSessionData {
  sessionId: string;
  visitorId: string;
  customerId?: string;
  type: SessionType;
  ipAddress: string;
  pageViews: number;
  lastSeenAt: string; // ISO string for JSON serialization
  converted: boolean;
  orderId?: string;
}

/**
 * Input for creating a new session
 */
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

/**
 * Input for tracking session events
 */
export interface TrackEventInput {
  sessionId: string;
  eventType: string; // 'page_view', 'add_to_cart', 'checkout_started', etc.
  page?: string;
  productId?: string;
  metadata?: Record<string, any>;
}

/**
 * Device information parsed from user agent
 */
export interface DeviceInfo {
  device: "mobile" | "tablet" | "desktop";
  browser: string;
  os: string;
}

/**
 * Extend Express Request type to include session
 */
declare global {
  namespace Express {
    interface Request {
      session?: SessionData;
      visitorId?: string;
    }
  }
}
```

---

## 📁 File 3: Session Repository

**File: `src/repositories/session.repository.ts`**

```typescript
import { prisma } from "../lib/prisma.js";
import { redis, REDIS_KEYS, REDIS_TTL } from "../lib/redis.js";
import {
  SessionData,
  RedisSessionData,
  CreateSessionInput,
  TrackEventInput,
  DeviceInfo,
} from "../types/session.types.js";
import { SessionType } from "@prisma/client";

class SessionRepository {
  /**
   * Create new session (both Redis + MongoDB)
   */
  async create(
    data: CreateSessionInput & { sessionId: string; visitorId: string }
  ): Promise<SessionData> {
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
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        pageViews: 0,
        startedAt: new Date(),
        lastSeenAt: new Date(),
        converted: false,
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

  /**
   * Get session (try Redis first, fallback to MongoDB)
   */
  async findBySessionId(sessionId: string): Promise<SessionData | null> {
    try {
      // Try Redis first (cache hit)
      const cached = await redis.get<RedisSessionData>(
        REDIS_KEYS.session(sessionId)
      );
      if (cached) {
        return this.fromRedisData(cached);
      }

      // Fallback to MongoDB (cache miss)
      const session = await prisma.session.findUnique({
        where: { sessionId },
      });

      if (!session) return null;

      // Re-cache if found in MongoDB
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
    } catch (error) {
      console.error("Error finding session:", error);
      return null;
    }
  }

  /**
   * Update session (both Redis + MongoDB)
   */
  async update(
    sessionId: string,
    data: Partial<SessionData>
  ): Promise<SessionData> {
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

  /**
   * Track event (create session event)
   */
  async createEvent(data: TrackEventInput): Promise<void> {
    try {
      await prisma.sessionEvent.create({
        data: {
          sessionId: data.sessionId,
          eventType: data.eventType,
          page: data.page,
          productId: data.productId,
          metadata: data.metadata || undefined,
        },
      });
    } catch (error) {
      console.error("Error creating session event:", error);
      // Don't throw - event tracking should not break the flow
    }
  }

  /**
   * Cache session in Redis with TTL
   */
  private async cacheSession(
    sessionId: string,
    data: RedisSessionData
  ): Promise<void> {
    try {
      await redis.setex(
        REDIS_KEYS.session(sessionId),
        REDIS_TTL.SESSION,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error("Error caching session in Redis:", error);
      // Don't throw - cache failures should not break the flow
    }
  }

  /**
   * Extend Redis TTL for active session
   */
  async extendTTL(sessionId: string): Promise<void> {
    try {
      await redis.expire(REDIS_KEYS.session(sessionId), REDIS_TTL.SESSION);
    } catch (error) {
      console.error("Error extending session TTL:", error);
    }
  }

  /**
   * Delete session from Redis (logout)
   */
  async deleteFromCache(sessionId: string): Promise<void> {
    try {
      await redis.del(REDIS_KEYS.session(sessionId));
    } catch (error) {
      console.error("Error deleting session from Redis:", error);
    }
  }

  /**
   * Convert Prisma session to SessionData
   */
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

  /**
   * Convert Redis data to SessionData
   */
  private fromRedisData(data: RedisSessionData): SessionData {
    return {
      sessionId: data.sessionId,
      visitorId: data.visitorId,
      customerId: data.customerId,
      type: data.type,
      ipAddress: data.ipAddress,
      userAgent: "", // Not stored in Redis for performance
      pageViews: data.pageViews,
      lastSeenAt: new Date(data.lastSeenAt),
      startedAt: new Date(data.lastSeenAt), // Approximate from cache
      converted: data.converted,
      orderId: data.orderId,
    };
  }

  /**
   * Parse user agent string to extract device info
   */
  private parseUserAgent(userAgent: string): DeviceInfo {
    const ua = userAgent.toLowerCase();

    // Detect device type
    let device: "mobile" | "tablet" | "desktop" = "desktop";
    if (/tablet|ipad/i.test(userAgent)) {
      device = "tablet";
    } else if (/mobile|android|iphone/i.test(userAgent)) {
      device = "mobile";
    }

    // Detect browser
    let browser = "Other";
    if (ua.includes("chrome") && !ua.includes("edg")) browser = "Chrome";
    else if (ua.includes("safari") && !ua.includes("chrome"))
      browser = "Safari";
    else if (ua.includes("firefox")) browser = "Firefox";
    else if (ua.includes("edg")) browser = "Edge";
    else if (ua.includes("opera") || ua.includes("opr")) browser = "Opera";

    // Detect OS
    let os = "Other";
    if (ua.includes("windows")) os = "Windows";
    else if (ua.includes("mac os")) os = "macOS";
    else if (ua.includes("linux")) os = "Linux";
    else if (ua.includes("android")) os = "Android";
    else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad"))
      os = "iOS";

    return { device, browser, os };
  }
}

export const sessionRepository = new SessionRepository();
```

---

## 📁 File 4: Session Service

**File: `src/services/session.service.ts`**

```typescript
import { v4 as uuidv4 } from "uuid";
import { SessionType } from "@prisma/client";
import { sessionRepository } from "../repositories/session.repository.js";
import {
  SessionData,
  CreateSessionInput,
  TrackEventInput,
} from "../types/session.types.js";

class SessionService {
  /**
   * Create a new session
   */
  async createSession(input: CreateSessionInput): Promise<SessionData> {
    const sessionId = uuidv4();
    const visitorId = input.visitorId || uuidv4();

    return await sessionRepository.create({
      ...input,
      sessionId,
      visitorId,
    });
  }

  /**
   * Get session by ID (cached)
   */
  async getSession(sessionId: string): Promise<SessionData | null> {
    return await sessionRepository.findBySessionId(sessionId);
  }

  /**
   * Extend session TTL in Redis and update lastSeenAt
   */
  async extendSession(sessionId: string): Promise<void> {
    // Extend TTL in Redis (sync)
    await sessionRepository.extendTTL(sessionId);

    // Update lastSeenAt in MongoDB (async, don't wait)
    sessionRepository
      .update(sessionId, {
        lastSeenAt: new Date(),
      })
      .catch((error) => {
        console.error("Failed to update session lastSeenAt:", error);
      });
  }

  /**
   * Convert anonymous session to customer session (on login)
   */
  async convertToCustomer(
    sessionId: string,
    customerId: string
  ): Promise<SessionData> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Update session type
    const updated = await sessionRepository.update(sessionId, {
      customerId,
      type: SessionType.CUSTOMER,
      lastSeenAt: new Date(),
    });

    // Track login event (async)
    this.trackEvent({
      sessionId,
      eventType: "customer_login",
      metadata: { customerId },
    }).catch(console.error);

    return updated;
  }

  /**
   * Mark session as converted (order completed)
   */
  async markAsConverted(
    sessionId: string,
    orderId: string
  ): Promise<SessionData> {
    const updated = await sessionRepository.update(sessionId, {
      converted: true,
      orderId,
      lastSeenAt: new Date(),
    });

    // Track conversion event (async)
    this.trackEvent({
      sessionId,
      eventType: "order_completed",
      metadata: { orderId },
    }).catch(console.error);

    return updated;
  }

  /**
   * Track an event within a session
   */
  async trackEvent(input: TrackEventInput): Promise<void> {
    // Create event record (async, don't block)
    sessionRepository.createEvent(input).catch((error) => {
      console.error("Failed to track event:", error);
    });

    // Increment page views if page_view event
    if (input.eventType === "page_view") {
      const session = await this.getSession(input.sessionId);
      if (session) {
        await sessionRepository.update(input.sessionId, {
          pageViews: session.pageViews + 1,
          lastSeenAt: new Date(),
        });
      }
    }
  }

  /**
   * Clear session (logout)
   */
  async clearSession(sessionId: string): Promise<void> {
    // Remove from Redis cache (MongoDB keeps historical data)
    await sessionRepository.deleteFromCache(sessionId);
  }
}

export const sessionService = new SessionService();
```

---

## 📁 File 5: Session Middleware (MAIN)

**File: `src/middlewares/session.middleware.ts`**

```typescript
import { Request, Response, NextFunction } from "express";
import { sessionService } from "../services/session.service.js";
import { SessionData } from "../types/session.types.js";

/**
 * Session middleware - Tracks all visitors and sessions
 *
 * Flow:
 * 1. Parse cookies (session, visitor_id)
 * 2. Try to resume existing session
 * 3. Create new session if none exists or expired
 * 4. Attach session to req.session
 * 5. Track page view event
 * 6. Extend session TTL
 */
export const sessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Parse cookies
    const sessionId = req.signedCookies?.session || req.cookies?.session;
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
      // Get IP address
      const ipAddress =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        (req.headers["x-real-ip"] as string) ||
        req.socket.remoteAddress ||
        "unknown";

      const newSessionData = await sessionService.createSession({
        visitorId: visitorIdFromCookie,
        ipAddress,
        userAgent: req.headers["user-agent"] || "unknown",
        landingPage: req.originalUrl,
        referrer: req.headers["referer"] || req.headers["referrer"],
        utmSource: req.query.utm_source as string,
        utmMedium: req.query.utm_medium as string,
        utmCampaign: req.query.utm_campaign as string,
      });

      session = newSessionData;

      // Set response cookies
      res.cookie("session", session.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 60 * 1000, // 30 minutes
        signed: true, // Use signed cookies for security
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

    // 5. Track page view event (async, don't wait)
    sessionService
      .trackEvent({
        sessionId: session.sessionId,
        eventType: "page_view",
        page: req.originalUrl,
      })
      .catch((error) => {
        console.error("Failed to track page view:", error);
      });

    next();
  } catch (error) {
    console.error("Session middleware error:", error);
    // Don't block the request if session fails
    // Continue without session
    next();
  }
};

/**
 * Optional middleware: Require authenticated customer session
 */
export const requireCustomerSession = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session || req.session.type !== "CUSTOMER") {
    res.status(401).json({
      success: false,
      error: "Authentication required",
      message: "Please log in to continue",
    });
    return;
  }
  next();
};

/**
 * Optional middleware: Attach session info but don't require it
 */
export const optionalSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sessionId = req.signedCookies?.session || req.cookies?.session;

    if (sessionId) {
      const session = await sessionService.getSession(sessionId);
      if (session) {
        req.session = session;
        req.visitorId = session.visitorId;
      }
    }
  } catch (error) {
    console.error("Optional session middleware error:", error);
  }

  next();
};
```

---

## 📁 File 6: Integration with App

**File: `src/server.ts` or `src/app.ts` (Update existing)**

```typescript
import express from "express";
import cookieParser from "cookie-parser";
import { sessionMiddleware } from "./middlewares/session.middleware.js";
import { testRedisConnection } from "./lib/redis.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser (REQUIRED for session middleware)
// Use a strong secret in production
app.use(cookieParser(process.env.COOKIE_SECRET || "your-secret-key"));

// Session middleware - Apply to storefront routes only
// Admin routes don't need session tracking
app.use("/api/storefront", sessionMiddleware);

// Your existing routes
// ... import and use routes ...

// Test Redis connection on startup
testRedisConnection().then((success) => {
  if (!success) {
    console.warn(
      "⚠️  Redis connection failed. Session tracking will not work properly."
    );
  }
});

export default app;
```

---

## 📁 File 7: Update Auth Service (Login Integration)

**File: `src/services/auth/customer-auth.service.ts` (Add to existing)**

```typescript
import { sessionService } from "../session.service.js";

class CustomerAuthService {
  async login(
    email: string,
    password: string,
    sessionId?: string // Pass from req.session?.sessionId
  ) {
    // ... existing validation ...

    const customer = await this.validateCredentials(email, password);
    const token = this.generateToken(customer);

    // NEW: Convert session to customer session
    if (sessionId) {
      try {
        await sessionService.convertToCustomer(sessionId, customer.id);
        console.log(
          `✅ Session ${sessionId} converted to customer ${customer.id}`
        );
      } catch (error) {
        console.error("Failed to convert session:", error);
        // Don't fail login if session conversion fails
      }
    }

    return { token, customer };
  }
}
```

**File: `src/controllers/storefront/auth.controller.ts` (Update login method)**

```typescript
async login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const sessionId = req.session?.sessionId; // Get from middleware

    const result = await customerAuthService.login(email, password, sessionId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
}
```

---

## 📁 File 8: Update Order Service (Conversion Tracking)

**File: `src/services/orders/orders.service.ts` (Add to existing)**

```typescript
import { sessionService } from "../session.service.js";

class OrdersService {
  async createOrder(
    input: CreateOrderInput,
    sessionId?: string // Pass from req.session?.sessionId
  ) {
    // ... existing order creation logic ...

    const order = await orderRepository.create({
      ...input,
      sessionId, // Store session reference
    });

    // NEW: Mark session as converted
    if (sessionId) {
      try {
        await sessionService.markAsConverted(sessionId, order.id);
        console.log(
          `✅ Session ${sessionId} marked as converted (Order: ${order.id})`
        );
      } catch (error) {
        console.error("Failed to mark session as converted:", error);
        // Don't fail order if session tracking fails
      }
    }

    // ... update customer analytics ...

    return order;
  }
}
```

**File: `src/controllers/storefront/orders.controller.ts` (Update create method)**

```typescript
async createOrder(req: Request, res: Response) {
  try {
    const sessionId = req.session?.sessionId; // Get from middleware

    const order = await ordersService.createOrder(req.body, sessionId);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}
```

---

## 🧪 Testing Files

### Postman Collection Test Cases

**Test 1: Create Anonymous Session**

```http
GET http://localhost:3000/api/storefront/products
```

**Expected:**

- Status: 200
- Response headers contain: `Set-Cookie: session=...` and `Set-Cookie: visitor_id=...`
- Session created in MongoDB
- Session cached in Redis

---

**Test 2: Resume Existing Session**

```http
GET http://localhost:3000/api/storefront/products/123
# Cookies automatically sent by Postman
```

**Expected:**

- Same session_id used
- Redis cache hit
- `pageViews` incremented

---

**Test 3: Login (Session Conversion)**

```http
POST http://localhost:3000/api/storefront/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Expected:**

- Session type: ANONYMOUS → CUSTOMER
- customerId populated
- Same session_id maintained

---

**Test 4: Create Order (Conversion)**

```http
POST http://localhost:3000/api/storefront/orders
Content-Type: application/json

{
  "items": [...],
  "shippingAddress": {...}
}
```

**Expected:**

- Order created
- Session marked: `converted: true`
- `orderId` populated

---

## 🚀 Implementation Checklist

### Phase 1: Setup

- [ ] Install dependencies (`npm install`)
- [ ] Create Upstash Redis account
- [ ] Add environment variables to `.env`
- [ ] Test Redis connection

### Phase 2: Core Files

- [ ] Create `src/lib/redis.ts`
- [ ] Create `src/types/session.types.ts`
- [ ] Create `src/repositories/session.repository.ts`
- [ ] Create `src/services/session.service.ts`

### Phase 3: Middleware

- [ ] Create `src/middlewares/session.middleware.ts`
- [ ] Update `src/server.ts` (add cookie-parser and session middleware)
- [ ] Test session creation with Postman

### Phase 4: Integration

- [ ] Update auth service (login conversion)
- [ ] Update order service (conversion tracking)
- [ ] Test complete flow: visit → login → order

### Phase 5: Verification

- [ ] Check Redis keys: `KEYS session:*`
- [ ] Check MongoDB: sessions collection
- [ ] Verify session events are tracked
- [ ] Test session expiration (wait 31 minutes)

---

## 📊 Monitoring Commands

### Redis CLI Commands (if using Redis CLI)

```bash
# List all session keys
KEYS session:*

# Get a specific session
GET session:abc-123-def-456

# Check TTL
TTL session:abc-123-def-456

# Count active sessions
KEYS session:* | wc -l
```

### MongoDB Queries

```javascript
// Find all sessions
db.sessions.find();

// Count active sessions (last 30 min)
db.sessions.count({
  lastSeenAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) },
});

// Find converted sessions
db.sessions.find({ converted: true });

// Find session events
db.session_events.find({ sessionId: "abc-123" });
```

---

## 🎯 Ready for Implementation!

All code is ready to copy and implement. Start with **Phase 1** and work through each phase sequentially.

**Questions? Issues? Let me know which phase you're on and I'll help debug!** 🚀
