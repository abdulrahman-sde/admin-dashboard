# Visitor Tracking & Analytics Guide

**For Admin Dashboard with Anonymous User Tracking**  
**Date:** December 6, 2025

---

## Table of Contents

1. [Overview: Why Track Anonymous Users?](#overview)
2. [Production Flow: Anonymous → Customer Journey](#production-flow)
3. [Session Tracking Implementation](#session-tracking)
4. [Calculating Dashboard Metrics](#dashboard-metrics)
5. [Customer Checkout Without Login](#checkout-flow)
6. [Real-time vs Batch Metrics](#realtime-vs-batch)
7. [Complete Code Examples](#code-examples)
8. [Privacy & GDPR Compliance](#privacy)

---

## 1. Overview: Why Track Anonymous Users?

### The Problem

Your dashboard shows metrics like:

- **Total Visits**: 9,504
- **Unique Visits**: 5,423
- **Existing Users**: 5,653
- **New Users**: 1,650
- **Conversion Rate**: 25%
- **Average Order Value**: $48.90

But how do you track these when users aren't logged in?

### The Solution

**Session-based tracking** using cookies/tokens to identify visitors BEFORE they become customers.

```
Anonymous Visitor → Session Created → Browse Products → Add to Cart → Checkout (Guest) → Becomes Customer
```

---

## 2. Production Flow: Anonymous → Customer Journey

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    VISITOR ARRIVES AT SITE                       │
│                    (No login required)                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Check Cookie    │
                 │ "session_id"    │
                 └────────┬────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
         No Cookie                Has Cookie
         (New Visitor)            (Returning)
              │                       │
              ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐
    │ Generate UUID    │    │ Load Session     │
    │ Set Cookie       │    │ Update lastSeen  │
    │ Create Session   │    │ Increment views  │
    └────────┬─────────┘    └────────┬─────────┘
             │                       │
             └───────────┬───────────┘
                         │
                         ▼
              ┌────────────────────┐
              │ Track Session      │
              │ • IP, User-Agent   │
              │ • Landing Page     │
              │ • Referrer         │
              │ • UTM params       │
              └────────┬───────────┘
                       │
                       ▼
              ┌────────────────────┐
              │ User Browses       │
              │ • Page views       │
              │ • Product views    │
              │ • Add to cart      │
              └────────┬───────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
    Leaves Site                 Proceeds to Checkout
         │                           │
         ▼                           ▼
    Mark session               ┌──────────────────┐
    endedAt                    │ GUEST CHECKOUT   │
                               │ Enter:           │
                               │ • Email          │
                               │ • Name           │
                               │ • Address        │
                               └────────┬─────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │ Create Customer  │
                               │ (No password!)   │
                               │ type = GUEST     │
                               └────────┬─────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │ Link Session     │
                               │ session.customerId│
                               │ session.converted │
                               └────────┬─────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │ Create Order     │
                               │ Update Analytics │
                               └────────┬─────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │ Session Metrics  │
                               │ • Conversion ✓   │
                               │ • Duration       │
                               │ • Pages viewed   │
                               └──────────────────┘
```

---

## 3. Session Tracking Implementation

### 3.1 Frontend: Create/Load Session

```typescript
// Frontend: lib/session.ts (Next.js/React)

import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

const SESSION_COOKIE_NAME = "visitor_session_id";
const SESSION_DURATION_DAYS = 30;

export function getOrCreateSessionId(): string {
  // Check if session exists
  let sessionId = Cookies.get(SESSION_COOKIE_NAME);

  if (!sessionId) {
    // Generate new session ID
    sessionId = uuidv4();

    // Store in cookie (30 days)
    Cookies.set(SESSION_COOKIE_NAME, sessionId, {
      expires: SESSION_DURATION_DAYS,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return sessionId;
}

// Send to backend on every page load
export async function trackPageView(page: string) {
  const sessionId = getOrCreateSessionId();

  await fetch("/api/v1/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      eventType: "page_view",
      page,
      timestamp: new Date().toISOString(),
    }),
  });
}

// Call in your Next.js layout or app component
export function useSessionTracking() {
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);
}
```

### 3.2 Backend: Create/Update Session

```typescript
// Backend: src/services/analytics.service.ts

import { prisma } from "../lib/prisma";
import geoip from "geoip-lite";
import UAParser from "ua-parser-js";

interface TrackingData {
  sessionId: string;
  eventType: string;
  page?: string;
  productId?: string;
  metadata?: any;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export async function trackEvent(data: TrackingData) {
  const {
    sessionId,
    eventType,
    page,
    productId,
    metadata,
    ipAddress,
    userAgent,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
  } = data;

  // Parse user agent
  const parser = new UAParser(userAgent);
  const device = parser.getDevice().type || "desktop";
  const browser = parser.getBrowser().name;
  const os = parser.getOS().name;

  // Get geo data
  const geo = geoip.lookup(ipAddress);
  const country = geo?.country;
  const city = geo?.city;

  // Find or create session
  let session = await prisma.session.findUnique({
    where: { sessionId },
  });

  if (!session) {
    // New session (new visitor)
    session = await prisma.session.create({
      data: {
        sessionId,
        type: "ANONYMOUS",
        ipAddress,
        userAgent,
        device,
        browser,
        os,
        country,
        city,
        landingPage: page,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        pageViews: 1,
        startedAt: new Date(),
        lastSeenAt: new Date(),
      },
    });
  } else {
    // Update existing session
    const now = new Date();
    const durationSeconds = Math.floor(
      (now.getTime() - session.startedAt.getTime()) / 1000
    );

    await prisma.session.update({
      where: { id: session.id },
      data: {
        lastSeenAt: now,
        durationSeconds,
        pageViews: { increment: 1 },
      },
    });
  }

  // Track event
  await prisma.sessionEvent.create({
    data: {
      sessionId: session.id,
      eventType,
      page,
      productId,
      metadata,
      timestamp: new Date(),
    },
  });

  return session;
}
```

### 3.3 API Route: Track Analytics

```typescript
// Backend: src/routes/analytics.route.ts

import { Router } from "express";
import { trackEvent } from "../services/analytics.service";

const router = Router();

router.post("/track", async (req, res) => {
  try {
    const { sessionId, eventType, page, productId, metadata } = req.body;

    // Get client IP and user agent
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    // Get UTM parameters
    const { utm_source, utm_medium, utm_campaign, ref } = req.query;

    await trackEvent({
      sessionId,
      eventType,
      page,
      productId,
      metadata,
      ipAddress: ipAddress as string,
      userAgent,
      referrer: ref as string,
      utmSource: utm_source as string,
      utmMedium: utm_medium as string,
      utmCampaign: utm_campaign as string,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    res.status(500).json({ error: "Failed to track event" });
  }
});

export default router;
```

---

## 4. Calculating Dashboard Metrics

### 4.1 Daily Metrics Calculation (Cron Job)

```typescript
// Backend: src/jobs/calculate-daily-metrics.ts

import { prisma } from "../lib/prisma";

export async function calculateDailyMetrics(date: Date) {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  // Calculate all metrics in parallel
  const [
    // Visitor metrics
    totalVisitsData,
    uniqueVisitsData,
    returningVisitorsData,

    // Session metrics
    sessionMetrics,

    // Conversion metrics
    conversions,
    cartAdditions,
    checkouts,

    // Sales metrics
    salesData,
    ordersData,

    // Customer metrics
    newCustomersData,
  ] = await Promise.all([
    // 1. Total Visits (all sessions started)
    prisma.session.count({
      where: { startedAt: { gte: startOfDay, lte: endOfDay } },
    }),

    // 2. Unique Visits (distinct sessionIds)
    prisma.session.groupBy({
      by: ["sessionId"],
      where: { startedAt: { gte: startOfDay, lte: endOfDay } },
      _count: { sessionId: true },
    }),

    // 3. Returning Visitors (sessions with existing customerId)
    prisma.session.count({
      where: {
        startedAt: { gte: startOfDay, lte: endOfDay },
        customerId: { not: null },
      },
    }),

    // 4. Session metrics (avg duration, pageviews)
    prisma.session.aggregate({
      where: { startedAt: { gte: startOfDay, lte: endOfDay } },
      _avg: { durationSeconds: true, pageViews: true },
      _sum: { pageViews: true },
    }),

    // 5. Conversions (sessions that resulted in orders)
    prisma.session.count({
      where: {
        startedAt: { gte: startOfDay, lte: endOfDay },
        converted: true,
      },
    }),

    // 6. Cart additions
    prisma.sessionEvent.count({
      where: {
        eventType: "add_to_cart",
        timestamp: { gte: startOfDay, lte: endOfDay },
      },
    }),

    // 7. Checkouts started
    prisma.sessionEvent.count({
      where: {
        eventType: "checkout_started",
        timestamp: { gte: startOfDay, lte: endOfDay },
      },
    }),

    // 8. Sales data
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        paymentStatus: "PAID",
      },
      _sum: { totalAmount: true },
      _count: true,
    }),

    // 9. Orders by status
    prisma.order.groupBy({
      by: ["orderStatus"],
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
      _count: true,
    }),

    // 10. New customers
    prisma.customer.count({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
    }),
  ]);

  // Calculate derived metrics
  const totalVisits = totalVisitsData;
  const uniqueVisits = uniqueVisitsData.length;
  const newUsers = totalVisits - returningVisitorsData;
  const existingUsers = returningVisitorsData;

  const conversionRate =
    totalVisits > 0 ? (conversions / totalVisits) * 100 : 0;

  const cartRate = totalVisits > 0 ? (cartAdditions / totalVisits) * 100 : 0;

  const checkoutRate =
    cartAdditions > 0 ? (checkouts / cartAdditions) * 100 : 0;

  const purchaseRate = checkouts > 0 ? (conversions / checkouts) * 100 : 0;

  const totalSales = salesData._sum.totalAmount || 0;
  const totalOrders = salesData._count || 0;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  const avgSessionDuration = sessionMetrics._avg.durationSeconds || 0;
  const totalPageViews = sessionMetrics._sum.pageViews || 0;
  const avgPageViewsPerSession =
    totalVisits > 0 ? totalPageViews / totalVisits : 0;

  // Get order breakdown
  const orderStatusMap = ordersData.reduce((acc, item) => {
    acc[item.orderStatus] = item._count;
    return acc;
  }, {} as Record<string, number>);

  // Upsert daily metrics
  await prisma.dailyMetrics.upsert({
    where: { date: startOfDay },
    update: {
      totalVisits,
      uniqueVisits,
      existingUsers,
      newUsers,
      avgSessionDuration,
      totalPageViews,
      avgPageViewsPerSession,
      conversionRate,
      cartRate,
      checkoutRate,
      purchaseRate,
      totalSales,
      totalOrders,
      averageOrderValue,
      newCustomers: newCustomersData,
      pendingOrders: orderStatusMap["PENDING"] || 0,
      processingOrders: orderStatusMap["PROCESSING"] || 0,
      shippedOrders: orderStatusMap["SHIPPED"] || 0,
      deliveredOrders: orderStatusMap["DELIVERED"] || 0,
      canceledOrders: orderStatusMap["CANCELED"] || 0,
    },
    create: {
      date: startOfDay,
      totalVisits,
      uniqueVisits,
      existingUsers,
      newUsers,
      avgSessionDuration,
      totalPageViews,
      avgPageViewsPerSession,
      conversionRate,
      cartRate,
      checkoutRate,
      purchaseRate,
      totalSales,
      totalOrders,
      averageOrderValue,
      newCustomers: newCustomersData,
      pendingOrders: orderStatusMap["PENDING"] || 0,
      processingOrders: orderStatusMap["PROCESSING"] || 0,
      shippedOrders: orderStatusMap["SHIPPED"] || 0,
      deliveredOrders: orderStatusMap["DELIVERED"] || 0,
      canceledOrders: orderStatusMap["CANCELED"] || 0,
    },
  });

  console.log(`✅ Daily metrics calculated for ${startOfDay.toISOString()}`);
}
```

### 4.2 Schedule the Job

```typescript
// Backend: src/jobs/scheduler.ts

import cron from "node-cron";
import { calculateDailyMetrics } from "./calculate-daily-metrics";

export function startAnalyticsJobs() {
  // Run daily at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("🕐 Calculating daily metrics...");
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await calculateDailyMetrics(yesterday);
  });

  // Update real-time metrics every minute
  cron.schedule("* * * * *", async () => {
    await updateRealtimeMetrics();
  });

  console.log("✅ Analytics cron jobs started");
}

async function updateRealtimeMetrics() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  // Count active sessions in last 30 minutes
  const activeUsers = await prisma.session.count({
    where: {
      lastSeenAt: { gte: thirtyMinutesAgo },
    },
  });

  await prisma.realtimeMetrics.create({
    data: {
      timestamp: new Date(),
      activeUsers,
      usersPerMinute: Math.floor(activeUsers / 30),
    },
  });
}
```

---

## 5. Customer Checkout Without Login

### 5.1 Guest Checkout Flow

```typescript
// Backend: src/services/checkout.service.ts

import { prisma } from "../lib/prisma";

interface GuestCheckoutData {
  sessionId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export async function processGuestCheckout(data: GuestCheckoutData) {
  return await prisma.$transaction(async (tx) => {
    // 1. Check if customer already exists by email
    let customer = await tx.customer.findUnique({
      where: { email: data.email },
    });

    if (!customer) {
      // 2. Create new guest customer (NO PASSWORD)
      customer = await tx.customer.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          type: "GUEST", // Important: guest checkout
          status: "ACTIVE",
          addresses: [
            {
              ...data.shippingAddress,
              isDefault: true,
              type: "shipping",
            },
          ],
          firstVisitDate: new Date(),
          firstOrderDate: new Date(),
        },
      });
    }

    // 3. Calculate order totals
    const products = await tx.product.findMany({
      where: { id: { in: data.items.map((i) => i.productId) } },
    });

    let subtotal = 0;
    const orderItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const totalPrice = product.price * item.quantity;
      subtotal += totalPrice;

      return {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        productImage: product.thumbnail,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice,
      };
    });

    const taxAmount = subtotal * 0.1;
    const shippingFee = 10;
    const totalAmount = subtotal + taxAmount + shippingFee;

    // 4. Create order
    const order = await tx.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 4)
          .toUpperCase()}`,
        customerId: customer.id,
        sessionId: data.sessionId, // Link to session!
        subtotal,
        taxAmount,
        shippingFee,
        totalAmount,
        orderStatus: "PENDING",
        paymentStatus: "PENDING",
        shippingAddress: data.shippingAddress,
        billingAddress: data.shippingAddress,
        items: {
          create: orderItems,
        },
      },
    });

    // 5. Update session - mark as converted
    await tx.session.update({
      where: { sessionId: data.sessionId },
      data: {
        customerId: customer.id,
        type: "CUSTOMER",
        converted: true,
        orderId: order.id,
      },
    });

    // 6. Update customer analytics
    await tx.customer.update({
      where: { id: customer.id },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: totalAmount },
        averageOrderValue:
          (customer.totalSpent + totalAmount) / (customer.totalOrders + 1),
        lastOrderDate: new Date(),
      },
    });

    // 7. Update product analytics
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          totalSales: { increment: item.quantity },
          totalRevenue: { increment: item.totalPrice },
          stockQuantity: { decrement: item.quantity },
        },
      });
    }

    return { order, customer };
  });
}
```

### 5.2 Optional: Allow Guest to Create Account Later

```typescript
// Backend: src/services/customer.service.ts

import bcrypt from "bcrypt";

export async function convertGuestToRegistered(
  customerId: string,
  password: string
) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer || customer.type !== "GUEST") {
    throw new Error("Customer not found or already registered");
  }

  // Create User account
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: customer.email,
      name: `${customer.firstName} ${customer.lastName}`,
      password: hashedPassword,
      role: "USER",
      status: "ACTIVE",
    },
  });

  // Link customer to user account
  await prisma.customer.update({
    where: { id: customerId },
    data: {
      userId: user.id,
      type: "REGISTERED",
    },
  });

  return { user, customer };
}
```

---

## 6. Real-time vs Batch Metrics

### When to Use Each

| Metric                         | Update Method            | Why                                   |
| ------------------------------ | ------------------------ | ------------------------------------- |
| **Total Visits**               | Batch (daily cron)       | Don't need real-time, historical data |
| **Active Users (last 30 min)** | Real-time (every minute) | Need live dashboard updates           |
| **Conversion Rate**            | Batch (daily/hourly)     | Calculated from historical data       |
| **Total Sales**                | Batch + cache            | Update nightly, cache for dashboard   |
| **Sales Goal Progress**        | Batch + manual refresh   | Update daily, recalc on demand        |

### Dashboard API Endpoint

```typescript
// Backend: src/routes/dashboard.route.ts

import { Router } from "express";
import { getCached } from "../utils/cache";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/metrics", async (req, res) => {
  // Get today's metrics (cached for 5 minutes)
  const metrics = await getCached(
    "dashboard:today-metrics",
    async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get from pre-calculated daily metrics
      const dailyMetrics = await prisma.dailyMetrics.findUnique({
        where: { date: today },
      });

      // Get real-time active users
      const realtimeMetrics = await prisma.realtimeMetrics.findFirst({
        orderBy: { timestamp: "desc" },
      });

      return {
        // Visitor metrics
        totalVisits: dailyMetrics?.totalVisits || 0,
        uniqueVisits: dailyMetrics?.uniqueVisits || 0,
        existingUsers: dailyMetrics?.existingUsers || 0,
        newUsers: dailyMetrics?.newUsers || 0,

        // Real-time
        activeUsersLast30Min: realtimeMetrics?.activeUsers || 0,
        usersPerMinute: realtimeMetrics?.usersPerMinute || 0,

        // Conversion
        conversionRate: dailyMetrics?.conversionRate || 0,
        cartRate: dailyMetrics?.cartRate || 0,
        checkoutRate: dailyMetrics?.checkoutRate || 0,
        purchaseRate: dailyMetrics?.purchaseRate || 0,

        // Sales
        totalSales: dailyMetrics?.totalSales || 0,
        totalOrders: dailyMetrics?.totalOrders || 0,
        averageOrderValue: dailyMetrics?.averageOrderValue || 0,

        // Sales goal
        salesGoal: dailyMetrics?.salesGoal || 20000,
        salesGoalProgress: dailyMetrics?.salesGoalProgress || 0,
      };
    },
    300 // 5 minutes cache
  );

  res.json(metrics);
});

export default router;
```

---

## 7. Privacy & GDPR Compliance

### 7.1 Data Retention Policy

```typescript
// Backend: src/jobs/cleanup.ts

import cron from "node-cron";
import { prisma } from "../lib/prisma";

export function startCleanupJobs() {
  // Delete old anonymous sessions (90 days)
  cron.schedule("0 2 * * 0", async () => {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    await prisma.session.deleteMany({
      where: {
        type: "ANONYMOUS",
        customerId: null,
        lastSeenAt: { lt: ninetyDaysAgo },
      },
    });

    console.log("✅ Cleaned up old anonymous sessions");
  });
}
```

### 7.2 Cookie Consent

```typescript
// Frontend: components/CookieConsent.tsx

export function CookieConsent() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent === "accepted") {
      setAccepted(true);
      // Initialize tracking
      trackPageView(window.location.pathname);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setAccepted(true);
    // Start tracking
    trackPageView(window.location.pathname);
  };

  if (accepted) return null;

  return (
    <div className="cookie-banner">
      <p>We use cookies to improve your experience.</p>
      <button onClick={handleAccept}>Accept</button>
    </div>
  );
}
```

---

## 8. Summary: Key Takeaways

### ✅ Customer Without Password

- Use `type: GUEST` for checkout without account
- Only require: email, name, address
- Optional: allow them to create account later with `convertGuestToRegistered()`

### ✅ Track Anonymous Users

- Use session cookies (`sessionId` UUID)
- Create `Session` record on first visit
- Track events: page views, add to cart, checkout
- Link session to customer on checkout

### ✅ Calculate Metrics

- **Batch processing**: Daily cron job for historical metrics
- **Real-time**: Update active users every minute
- **Cache**: Redis cache for dashboard queries (5-min TTL)

### ✅ Conversion Tracking

```
Session Created → Browse → Add to Cart → Checkout → Order Created
                                                    ↓
                                          Session.converted = true
                                          Session.customerId = X
```

### ✅ Privacy

- Cookie consent banner
- Delete old anonymous sessions (90 days)
- GDPR-compliant data retention

---

## Next Steps

1. **Implement session tracking** in your Next.js frontend
2. **Add analytics routes** to your Express backend
3. **Create daily metrics cron job**
4. **Build dashboard API** to fetch metrics
5. **Test guest checkout flow**
6. **Add real-time metrics** (optional)

Your dashboard will now track everything without requiring user login! 🚀
