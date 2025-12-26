# Session Service Implementation

## Complete Service Layer & Integration Guide

---

## 📦 File Structure

```
src/
├── lib/
│   └── redis.ts                    # Upstash Redis client
├── types/
│   └── session.types.ts            # Session types & interfaces
├── middleware/
│   └── session.middleware.ts       # Session middleware
├── repositories/
│   └── session.repository.ts       # Database operations
├── services/
│   ├── session.service.ts          # Business logic
│   └── analytics.service.ts        # Metrics aggregation
├── controllers/
│   └── storefront/
│       └── session.controller.ts   # Session endpoints (debug)
├── routes/
│   └── storefront/
│       └── session.routes.ts       # Session routes
└── jobs/
    └── session-cleanup.job.ts      # Cleanup cron job
```

---

## 🔧 Implementation: Session Service

**File: `src/services/session.service.ts`**

```typescript
import { v4 as uuidv4 } from "uuid";
import { SessionType } from "@prisma/client";
import { sessionRepository } from "../repositories/session.repository";
import {
  SessionData,
  CreateSessionInput,
  TrackEventInput,
} from "../types/session.types";
import { redis, REDIS_KEYS } from "../lib/redis";

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
   * Extend session TTL in Redis
   */
  async extendSession(sessionId: string): Promise<void> {
    await sessionRepository.extendTTL(sessionId);

    // Update lastSeenAt in MongoDB (async, don't wait)
    sessionRepository
      .update(sessionId, {
        lastSeenAt: new Date(),
      })
      .catch(console.error);
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

    // Track login event
    await this.trackEvent({
      sessionId,
      eventType: "customer_login",
      metadata: { customerId },
    });

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

    // Track conversion event
    await this.trackEvent({
      sessionId,
      eventType: "order_completed",
      metadata: { orderId },
    });

    return updated;
  }

  /**
   * Track an event within a session
   */
  async trackEvent(input: TrackEventInput): Promise<void> {
    // Create event record (async, use queue in production)
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
   * Get active sessions count (real-time)
   */
  async getActiveSessionsCount(): Promise<number> {
    // In production, maintain a sorted set in Redis
    // For now, we can use a simple counter
    const count = await redis.get<number>(REDIS_KEYS.activeUsers);
    return count || 0;
  }

  /**
   * Clear session (logout)
   */
  async clearSession(sessionId: string): Promise<void> {
    // Remove from Redis (MongoDB keeps historical data)
    await redis.del(REDIS_KEYS.session(sessionId));
  }
}

export const sessionService = new SessionService();
```

---

## 🔗 Integration with Existing Services

### 1. Update Auth Service (Customer Login)

**File: `src/services/auth/customer-auth.service.ts`**

Add session conversion on login:

```typescript
import { sessionService } from "../session.service";

class CustomerAuthService {
  async login(email: string, password: string, sessionId?: string) {
    // ... existing validation ...

    const customer = await this.validateCredentials(email, password);
    const token = this.generateToken(customer);

    // NEW: Convert session to customer session
    if (sessionId) {
      try {
        await sessionService.convertToCustomer(sessionId, customer.id);
      } catch (error) {
        console.error("Failed to convert session:", error);
        // Don't fail login if session conversion fails
      }
    }

    return { token, customer };
  }
}
```

### 2. Update Order Service (Conversion Tracking)

**File: `src/services/orders/orders.service.ts`**

Add session tracking on order creation:

```typescript
import { sessionService } from "../session.service";

class OrdersService {
  async createOrder(input: CreateOrderInput, sessionId?: string) {
    // ... existing order creation logic ...

    const order = await orderRepository.create({
      ...input,
      sessionId, // Store session reference
    });

    // NEW: Mark session as converted
    if (sessionId) {
      try {
        await sessionService.markAsConverted(sessionId, order.id);
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

---

## 📊 Analytics Service

**File: `src/services/analytics.service.ts`**

```typescript
import { prisma } from "../lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

class AnalyticsService {
  /**
   * Aggregate daily metrics from sessions
   * Run this as a cron job every day at midnight
   */
  async aggregateDailyMetrics(date: Date = new Date()): Promise<void> {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    // Get all sessions for the day
    const sessions = await prisma.session.findMany({
      where: {
        startedAt: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    // Calculate metrics
    const totalVisits = sessions.length;
    const uniqueVisits = new Set(sessions.map((s) => s.sessionId)).size;

    // Count new vs returning visitors
    const visitorFirstSessions = await this.getFirstSessionsByVisitor(
      sessions.map((s) => s.visitorId)
    );
    const newUsers = sessions.filter(
      (s) =>
        visitorFirstSessions.get(s.visitorId)?.startedAt.getTime() ===
        s.startedAt.getTime()
    ).length;
    const existingUsers = totalVisits - newUsers;

    // Session metrics
    const totalPageViews = sessions.reduce((sum, s) => sum + s.pageViews, 0);
    const avgPageViewsPerSession =
      totalVisits > 0 ? totalPageViews / totalVisits : 0;

    // Calculate session durations
    const sessionDurations = sessions.map(
      (s) => (s.lastSeenAt.getTime() - s.startedAt.getTime()) / 1000
    );
    const avgSessionDuration =
      sessionDurations.length > 0
        ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
        : 0;

    // Conversion metrics
    const convertedSessions = sessions.filter((s) => s.converted);
    const conversionRate =
      totalVisits > 0 ? (convertedSessions.length / totalVisits) * 100 : 0;

    // Get order data for the day
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Customer metrics
    const newCustomers = await prisma.customer.count({
      where: {
        createdAt: {
          gte: dayStart,
          lte: dayEnd,
        },
        isGuest: false,
      },
    });

    // Order status breakdown
    const pendingOrders = orders.filter(
      (o) => o.fulfillmentStatus === "PENDING"
    ).length;
    const processingOrders = orders.filter(
      (o) => o.fulfillmentStatus === "PROCESSING"
    ).length;
    const shippedOrders = orders.filter(
      (o) => o.fulfillmentStatus === "SHIPPED"
    ).length;
    const deliveredOrders = orders.filter(
      (o) => o.fulfillmentStatus === "DELIVERED"
    ).length;
    const canceledOrders = orders.filter(
      (o) => o.fulfillmentStatus === "CANCELED"
    ).length;

    // Upsert daily metrics
    await prisma.dailyMetrics.upsert({
      where: { date: dayStart },
      create: {
        date: dayStart,
        totalVisits,
        uniqueVisits,
        newUsers,
        existingUsers,
        avgSessionDuration,
        totalPageViews,
        avgPageViewsPerSession,
        conversionRate,
        totalSales,
        totalOrders,
        averageOrderValue,
        newCustomers,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        canceledOrders,
      },
      update: {
        totalVisits,
        uniqueVisits,
        newUsers,
        existingUsers,
        avgSessionDuration,
        totalPageViews,
        avgPageViewsPerSession,
        conversionRate,
        totalSales,
        totalOrders,
        averageOrderValue,
        newCustomers,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        canceledOrders,
      },
    });

    console.log(
      `✅ Aggregated metrics for ${dayStart.toISOString().split("T")[0]}`
    );
  }

  /**
   * Get first session for each visitor
   */
  private async getFirstSessionsByVisitor(visitorIds: string[]) {
    const sessions = await prisma.session.findMany({
      where: { visitorId: { in: visitorIds } },
      orderBy: { startedAt: "asc" },
    });

    const map = new Map();
    sessions.forEach((session) => {
      if (!map.has(session.visitorId)) {
        map.set(session.visitorId, session);
      }
    });

    return map;
  }

  /**
   * Get real-time active users (last 30 minutes)
   */
  async getRealtimeActiveUsers(): Promise<number> {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const count = await prisma.session.count({
      where: {
        lastSeenAt: {
          gte: thirtyMinutesAgo,
        },
      },
    });

    return count;
  }

  /**
   * Update real-time metrics (run every minute)
   */
  async updateRealtimeMetrics(): Promise<void> {
    const activeUsers = await this.getRealtimeActiveUsers();

    await prisma.realtimeMetrics.create({
      data: {
        activeUsers,
        timestamp: new Date(),
      },
    });
  }
}

export const analyticsService = new AnalyticsService();
```

---

## 🕒 Cron Jobs

**File: `src/jobs/session-cleanup.job.ts`**

```typescript
import { prisma } from "../lib/prisma";
import { analyticsService } from "../services/analytics.service";

/**
 * Cleanup old sessions (run daily at 2 AM)
 */
export async function cleanupOldSessions() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Don't delete, just mark as inactive by adding a flag or archiving
  // For now, we can leave sessions in MongoDB for analytics

  console.log("✅ Session cleanup completed");
}

/**
 * Aggregate daily metrics (run daily at midnight)
 */
export async function aggregateDailyMetricsJob() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await analyticsService.aggregateDailyMetrics(yesterday);

  console.log("✅ Daily metrics aggregation completed");
}

/**
 * Update real-time metrics (run every minute)
 */
export async function updateRealtimeMetricsJob() {
  await analyticsService.updateRealtimeMetrics();

  console.log("✅ Real-time metrics updated");
}
```

**Integration with cron (using node-cron):**

```typescript
// src/app.ts or src/server.ts
import cron from "node-cron";
import {
  cleanupOldSessions,
  aggregateDailyMetricsJob,
  updateRealtimeMetricsJob,
} from "./jobs/session-cleanup.job";

// Run cleanup daily at 2 AM
cron.schedule("0 2 * * *", cleanupOldSessions);

// Run aggregation daily at midnight
cron.schedule("0 0 * * *", aggregateDailyMetricsJob);

// Run real-time metrics every minute
cron.schedule("* * * * *", updateRealtimeMetricsJob);
```

---

## 🎯 Session Controller (Debug/Testing)

**File: `src/controllers/storefront/session.controller.ts`**

```typescript
import { Request, Response } from "express";
import { sessionService } from "../../services/session.service";
import { analyticsService } from "../../services/analytics.service";

class SessionController {
  /**
   * Get current session info (for debugging)
   */
  async getCurrentSession(req: Request, res: Response) {
    try {
      if (!req.session) {
        return res.status(404).json({
          success: false,
          error: "No active session",
        });
      }

      res.json({
        success: true,
        data: {
          session: req.session,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Track custom event
   */
  async trackEvent(req: Request, res: Response) {
    try {
      const { eventType, page, productId, metadata } = req.body;

      if (!req.session) {
        return res.status(400).json({
          success: false,
          error: "No active session",
        });
      }

      await sessionService.trackEvent({
        sessionId: req.session.sessionId,
        eventType,
        page,
        productId,
        metadata,
      });

      res.json({
        success: true,
        message: "Event tracked successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get active users count
   */
  async getActiveUsers(req: Request, res: Response) {
    try {
      const count = await analyticsService.getRealtimeActiveUsers();

      res.json({
        success: true,
        data: {
          activeUsers: count,
          timestamp: new Date(),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Clear current session (logout)
   */
  async clearSession(req: Request, res: Response) {
    try {
      if (req.session) {
        await sessionService.clearSession(req.session.sessionId);
      }

      res.clearCookie("session");

      res.json({
        success: true,
        message: "Session cleared",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export const sessionController = new SessionController();
```

**File: `src/routes/storefront/session.routes.ts`**

```typescript
import { Router } from "express";
import { sessionController } from "../../controllers/storefront/session.controller";

const router = Router();

// Debug endpoints (consider removing in production or adding auth)
router.get("/current", sessionController.getCurrentSession);
router.get("/active-users", sessionController.getActiveUsers);
router.post("/track-event", sessionController.trackEvent);
router.post("/clear", sessionController.clearSession);

export default router;
```

---

## 🔐 Environment Variables

**File: `.env`**

```bash
# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Cookie Secret (for signing cookies)
COOKIE_SECRET=your-super-secret-key-at-least-32-chars

# Environment
NODE_ENV=development
```

**File: `.env.example`**

```bash
# Upstash Redis Configuration
# Get these from: https://console.upstash.com/
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Cookie Secret (generate with: openssl rand -base64 32)
COOKIE_SECRET=

# Environment
NODE_ENV=development
```

---

## 📦 Dependencies Installation

```bash
npm install @upstash/redis cookie-parser uuid date-fns node-cron
npm install --save-dev @types/cookie-parser @types/uuid @types/node-cron
```

---

## 🚀 Wiring Everything Together

**File: `src/app.ts`**

```typescript
import express from "express";
import cookieParser from "cookie-parser";
import { sessionMiddleware } from "./middleware/session.middleware";
import sessionRoutes from "./routes/storefront/session.routes";
import cron from "node-cron";
import {
  cleanupOldSessions,
  aggregateDailyMetricsJob,
  updateRealtimeMetricsJob,
} from "./jobs/session-cleanup.job";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET)); // Signed cookies

// Session middleware (applies to storefront routes only)
app.use("/api/storefront", sessionMiddleware);

// Routes
app.use("/api/storefront/session", sessionRoutes);
// ... other routes ...

// Cron jobs (only in production or specific instance)
if (process.env.ENABLE_CRON === "true") {
  cron.schedule("0 2 * * *", cleanupOldSessions);
  cron.schedule("0 0 * * *", aggregateDailyMetricsJob);
  cron.schedule("* * * * *", updateRealtimeMetricsJob);
  console.log("✅ Cron jobs initialized");
}

export default app;
```

---

## ✅ Implementation Checklist

### Phase 1: Foundation (Day 1)

- [ ] Install dependencies
- [ ] Set up Upstash Redis account and get credentials
- [ ] Create `lib/redis.ts`
- [ ] Create `types/session.types.ts`
- [ ] Add environment variables

### Phase 2: Core Session (Day 1-2)

- [ ] Create `repositories/session.repository.ts`
- [ ] Create `services/session.service.ts`
- [ ] Create `middleware/session.middleware.ts`
- [ ] Wire middleware to app.ts

### Phase 3: Integration (Day 2)

- [ ] Update auth service (login conversion)
- [ ] Update order service (conversion tracking)
- [ ] Test session flow with Postman

### Phase 4: Analytics (Day 3)

- [ ] Create `services/analytics.service.ts`
- [ ] Create `jobs/session-cleanup.job.ts`
- [ ] Set up cron jobs
- [ ] Test daily aggregation

### Phase 5: Testing & Debug (Day 3-4)

- [ ] Create session controller & routes
- [ ] Create Postman collection
- [ ] Test all flows end-to-end
- [ ] Monitor Redis & MongoDB data

### Phase 6: Production Ready (Day 4-5)

- [ ] Add rate limiting
- [ ] Add error handling
- [ ] Add monitoring/logging
- [ ] Performance testing
- [ ] Security audit

---

## 🎯 Testing Sequence

### 1. Basic Flow Test

```
1. GET /api/storefront/products
   → Creates session, sets cookies

2. GET /api/storefront/session/current
   → Shows session data

3. GET /api/storefront/products/123
   → Increments pageViews

4. GET /api/storefront/session/current
   → Verify pageViews increased
```

### 2. Login Flow Test

```
1. Create anonymous session (GET /products)
2. POST /api/storefront/auth/login
3. GET /api/storefront/session/current
   → Verify type: CUSTOMER, customerId populated
```

### 3. Conversion Flow Test

```
1. Create session
2. Login
3. POST /api/storefront/orders (create order)
4. GET /api/storefront/session/current
   → Verify converted: true, orderId populated
```

### 4. Session Expiration Test

```
1. Create session
2. Wait 31 minutes
3. GET /api/storefront/products
   → Should create new session (old one expired from Redis)
```

---

## 🔍 Monitoring & Debugging

### Redis Keys to Monitor

```bash
# Check active sessions
KEYS session:*

# Get specific session
GET session:abc-123-def-456

# Check TTL
TTL session:abc-123-def-456
```

### MongoDB Queries

```javascript
// Count active sessions (last 30 min)
db.sessions.count({
  lastSeenAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) },
});

// Find converted sessions
db.sessions.find({ converted: true });

// Session events for a session
db.session_events.find({ sessionId: "abc-123" });
```

---

## 🎉 Ready to Implement!

Start with **Phase 1** and work your way through. Each phase builds on the previous one.

**Questions to answer:**

1. Should we start with Phase 1 (Foundation)?
2. Do you have Upstash Redis set up?
3. Any specific features you want to prioritize?

Let me know when you're ready to begin! 🚀
