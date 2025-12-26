# DEALPORT Dashboard Development Assistant Guide

**Version:** 1.0  
**Last Updated:** December 6, 2025  
**Tech Stack:** Node.js + Express.js + TypeScript + MongoDB + Prisma + Redis

---

## 📋 Table of Contents

1. [Architecture Overview & Techniques](#1-architecture-overview--techniques)
2. [Production-Grade Practices Summary](#2-production-grade-practices-summary)
3. [System Flow Diagrams](#3-system-flow-diagrams)
4. [Project Overview](#4-project-overview)
5. [Database Schema Design](#5-database-schema-design)
6. [Data Seeding Strategy](#6-data-seeding-strategy)
7. [Performance Optimization](#7-performance-optimization)
8. [Caching Strategy with Redis](#8-caching-strategy-with-redis)
9. [Calculation Strategies](#9-calculation-strategies)
10. [MongoDB Best Practices](#10-mongodb-best-practices)
11. [Production-Grade Approaches](#11-production-grade-approaches)
12. [API Design & Implementation](#12-api-design--implementation)
13. [Monitoring & Observability](#13-monitoring--observability)

---

## 1. Architecture Overview & Techniques

### 1.1 Core Technologies & Their Roles

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEALPORT DASHBOARD SYSTEM                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Next.js    │───▶│  Express.js  │───▶│   MongoDB    │
│  Frontend    │    │   REST API   │    │   Database   │
│ (Dashboard)  │    │  (Backend)   │    │   (Prisma)   │
└──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Redis     │
                    │    Cache     │
                    └──────────────┘
```

#### **Technology Stack Breakdown:**

| Technology               | Purpose                     | Why We Use It                                       |
| ------------------------ | --------------------------- | --------------------------------------------------- |
| **Node.js + Express.js** | Backend Runtime & Framework | Fast, async I/O, large ecosystem                    |
| **TypeScript**           | Type-safe JavaScript        | Catches errors at compile time, better DX           |
| **MongoDB**              | NoSQL Database              | Flexible schema, horizontal scaling, JSON documents |
| **Prisma ORM**           | Database Access Layer       | Type-safe queries, migrations, excellent DX         |
| **Redis**                | In-memory Cache             | Sub-millisecond response, reduces DB load           |
| **node-cron**            | Task Scheduler              | Run periodic jobs (daily stats, cleanup)            |
| **JWT**                  | Authentication              | Stateless, scalable auth mechanism                  |
| **Zod**                  | Runtime Validation          | Type-safe request validation                        |
| **Winston/Pino**         | Logging                     | Structured logging for debugging                    |

---

### 1.2 Key Techniques Explained

#### **Technique 1: Data Denormalization**

**What:** Store calculated/aggregated data directly in documents instead of computing on-the-fly.

**Example:**

```javascript
// ❌ BAD: Calculate every time (slow)
const customer = await prisma.customer.findUnique({ id: "123" });
const orders = await prisma.order.findMany({
  where: { customerId: "123", paymentStatus: "PAID" },
});
const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

// ✅ GOOD: Pre-calculated (fast)
const customer = await prisma.customer.findUnique({
  where: { id: "123" },
  select: { totalSpent: true }, // Already stored!
});
```

**Trade-off:**

- ✅ **Pro:** Lightning-fast reads (dashboard loads instantly)
- ❌ **Con:** Need to update multiple places on writes (acceptable trade-off)

---

#### **Technique 2: Redis Caching (Cache-Aside Pattern)**

**What:** Store frequently accessed data in Redis (in-memory) to avoid hitting MongoDB.

**Flow:**

```
1. Request comes in for dashboard metrics
2. Check Redis cache first (key: "dashboard:metrics")
3. IF found → Return cached data (< 5ms response)
4. IF NOT found → Query MongoDB → Store in Redis → Return data
5. Cache expires after TTL (5-60 minutes depending on data type)
```

**Example:**

```javascript
// Check cache first
const cached = await redis.get("dashboard:metrics");
if (cached) return JSON.parse(cached); // 🚀 Super fast!

// Cache miss - query database
const metrics = await calculateMetrics(); // Slower

// Store for next time
await redis.setex("dashboard:metrics", 300, JSON.stringify(metrics)); // 5 min TTL
return metrics;
```

**Cache Invalidation:** When data changes (new order), delete related cache keys.

---

#### **Technique 3: Cron Jobs for Scheduled Tasks**

**What:** Automated tasks that run on a schedule (e.g., every night at midnight).

**Use Cases:**

1. **Daily Stats Aggregation** - Calculate yesterday's sales, orders, revenue
2. **Cache Warming** - Pre-populate cache with common queries
3. **Data Cleanup** - Delete old logs, expired tokens
4. **Report Generation** - Create weekly/monthly reports

**Implementation with node-cron:**

```javascript
import cron from "node-cron";

// Run every day at midnight (0 0 * * *)
cron.schedule("0 0 * * *", async () => {
  console.log("🕐 Running daily stats job...");
  await calculateDailyStats(new Date());
});

// Run every hour (0 * * * *)
cron.schedule("0 * * * *", async () => {
  console.log("🧹 Clearing stale cache...");
  await clearStaleCache();
});

// Run every 5 minutes (*/5 * * * *)
cron.schedule("*/5 * * * *", async () => {
  console.log("📊 Updating real-time metrics...");
  await updateRealtimeMetrics();
});
```

**Cron Schedule Format:**

```
 ┌────────────── second (optional, 0-59)
 │ ┌──────────── minute (0-59)
 │ │ ┌────────── hour (0-23)
 │ │ │ ┌──────── day of month (1-31)
 │ │ │ │ ┌────── month (1-12)
 │ │ │ │ │ ┌──── day of week (0-6, Sunday=0)
 │ │ │ │ │ │
 * * * * * *
```

---

#### **Technique 4: Database Transactions**

**What:** Group multiple database operations into a single atomic unit (all succeed or all fail).

**Why:** Ensure data consistency when updating multiple documents.

**Example - Processing an Order:**

```javascript
// Without transaction (❌ DANGEROUS - can leave inconsistent data)
await prisma.order.update({ where: { id }, data: { status: "PAID" } });
await prisma.customer.update({
  /* update totals */
}); // ⚠️ If this fails, order is marked paid but customer stats are wrong!

// With transaction (✅ SAFE - all or nothing)
await prisma.$transaction(async (tx) => {
  // 1. Update order
  await tx.order.update({ where: { id }, data: { status: "PAID" } });

  // 2. Update customer stats
  await tx.customer.update({
    where: { id: customerId },
    data: {
      totalOrders: { increment: 1 },
      totalSpent: { increment: orderAmount },
    },
  });

  // 3. Update product inventory
  for (const item of items) {
    await tx.product.update({
      where: { id: item.productId },
      data: { stockQuantity: { decrement: item.quantity } },
    });
  }

  // If ANY operation fails, ALL are rolled back
});
```

---

#### **Technique 5: Database Indexing**

**What:** Create indexes on frequently queried fields for faster lookups.

**Example:**

```prisma
model Order {
  id String @id
  customerId String @db.ObjectId
  createdAt DateTime
  status OrderStatus

  @@index([customerId])  // Fast customer order lookups
  @@index([createdAt])   // Fast date range queries
  @@index([status])      // Fast status filtering
}
```

**Without Index:** MongoDB scans entire collection (slow for large datasets)
**With Index:** MongoDB uses B-tree structure (logarithmic time complexity)

```
Collection with 1 million orders:
❌ No index: ~500ms query time
✅ With index: ~5ms query time
```

---

#### **Technique 6: Application-Level Analytics Updates**

**What:** Update analytics fields (totalOrders, totalSpent) in application code, not database triggers.

**Why MongoDB doesn't use triggers:**

- MongoDB has "Change Streams" but they're complex and add overhead
- Application-level logic is easier to test, debug, and maintain
- Full control over when/how updates happen

**Pattern:**

```javascript
async function createOrder(orderData) {
  return await prisma.$transaction(async (tx) => {
    // 1. Create the order
    const order = await tx.order.create({ data: orderData });

    // 2. Update customer analytics (application-level)
    await tx.customer.update({
      where: { id: orderData.customerId },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: orderData.totalAmount },
        lastOrderDate: new Date(),
      },
    });

    // 3. Update product analytics
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          totalSales: { increment: item.quantity },
          totalRevenue: { increment: item.totalPrice },
        },
      });
    }

    return order;
  });
}
```

---

#### **Technique 7: Pagination**

**What:** Return data in chunks (pages) instead of all at once.

**Why:** Prevents memory overflow and improves response time.

```javascript
// ❌ BAD: Return all 50,000 products
const products = await prisma.product.findMany();

// ✅ GOOD: Return 20 products per page
const page = 1;
const limit = 20;
const products = await prisma.product.findMany({
  take: limit,
  skip: (page - 1) * limit,
  orderBy: { createdAt: "desc" },
});
```

---

#### **Technique 8: Rate Limiting**

**What:** Limit number of requests per IP/user to prevent abuse.

**Example:**

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests, please try again later.",
});

app.use("/api/", limiter);
```

---

#### **Technique 9: Soft Delete**

**What:** Mark records as deleted instead of actually deleting them.

**Why:** Data recovery, audit trails, referential integrity.

```prisma
model Customer {
  id String @id
  name String
  deletedAt DateTime? // NULL = active, timestamp = deleted
}

// "Delete" customer
await prisma.customer.update({
  where: { id },
  data: { deletedAt: new Date() }
});

// Query only active customers
await prisma.customer.findMany({
  where: { deletedAt: null }
});
```

---

## 2. Production-Grade Practices Summary

### 2.1 The 12-Factor App Principles Applied

| Principle                | Implementation                | Example                                |
| ------------------------ | ----------------------------- | -------------------------------------- |
| **1. Codebase**          | Single repo, multiple deploys | Git repo → dev/staging/prod            |
| **2. Dependencies**      | Explicit in package.json      | All deps listed, lock file committed   |
| **3. Config**            | Environment variables         | `.env` files, never hardcode           |
| **4. Backing Services**  | Treat as attached resources   | MongoDB URL in env, swap easily        |
| **5. Build/Release/Run** | Separate stages               | `npm run build` → deploy → `npm start` |
| **6. Processes**         | Stateless                     | Session in Redis, not memory           |
| **7. Port Binding**      | Self-contained                | Express listens on `process.env.PORT`  |
| **8. Concurrency**       | Scale via processes           | PM2/Docker containers                  |
| **9. Disposability**     | Fast startup/shutdown         | Graceful shutdown handlers             |
| **10. Dev/Prod Parity**  | Same stack everywhere         | Docker ensures consistency             |
| **11. Logs**             | Treat as event streams        | Winston → stdout → log aggregator      |
| **12. Admin Processes**  | Run as one-off processes      | Seed scripts, migrations               |

---

### 2.2 Security Best Practices

```javascript
// 1. Environment Variables (NEVER commit secrets)
// ❌ BAD
const apiKey = "sk-abc123...";

// ✅ GOOD
const apiKey = process.env.API_KEY;

// 2. Password Hashing (NEVER store plain text)
// ❌ BAD
user.password = "password123";

// ✅ GOOD
import bcrypt from "bcrypt";
user.password = await bcrypt.hash(password, 10);

// 3. JWT Authentication (stateless, secure)
import jwt from "jsonwebtoken";
const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
  expiresIn: "15m",
});

// 4. Input Validation (prevent injection)
import { z } from "zod";
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(150),
});

// 5. HTTP-only Cookies (prevent XSS)
res.cookie("refreshToken", token, {
  httpOnly: true, // Can't access via JavaScript
  secure: true, // HTTPS only
  sameSite: "strict",
});

// 6. CORS (control who can access API)
import cors from "cors";
app.use(cors({ origin: "https://yourdomain.com" }));

// 7. Helmet (security headers)
import helmet from "helmet";
app.use(helmet());

// 8. Rate Limiting (prevent brute force)
// Already covered above
```

---

### 2.3 Error Handling Strategy

```javascript
// 1. Custom Error Classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// 2. Global Error Handler
app.use((err, req, res, next) => {
  // Log error
  logger.error(err);

  // Don't leak internal errors to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Generic error for unexpected issues
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
});

// 3. Async Error Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
app.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  })
);
```

---

### 2.4 Logging Levels

```javascript
import winston from "winston";

const logger = winston.createLogger({
  levels: {
    error: 0, // 🔴 Critical errors (database down, etc.)
    warn: 1, // 🟡 Warnings (deprecated API usage)
    info: 2, // 🔵 General info (server started)
    http: 3, // 📡 HTTP requests
    debug: 4, // 🐛 Debugging (dev only)
  },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Usage
logger.error("Database connection failed", { error: err });
logger.warn("Cache miss for key: dashboard:metrics");
logger.info("Server started on port 5000");
logger.debug("Processing order", { orderId: "123" });
```

---

### 2.5 Performance Monitoring Metrics

**What to Track:**

1. **Response Time**

   - P50 (median): 50% of requests faster than X ms
   - P95: 95% of requests faster than X ms
   - P99: 99% of requests faster than X ms

2. **Throughput**

   - Requests per second (RPS)
   - Orders processed per minute

3. **Error Rate**

   - % of requests that fail (target: < 0.1%)

4. **Database Metrics**

   - Query duration
   - Connection pool usage
   - Index hit ratio

5. **Cache Metrics**

   - Hit rate (target: > 80%)
   - Miss rate
   - Eviction rate

6. **System Resources**
   - CPU usage (target: < 70%)
   - Memory usage
   - Network I/O

---

## 3. System Flow Diagrams

### 3.1 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Next.js Admin Dashboard)             │
│                    ┌──────────────┐  ┌──────────────┐               │
│                    │ Auth Pages   │  │  Dashboard   │               │
│                    │ Login/Register│  │   Metrics    │               │
│                    └──────┬───────┘  └──────┬───────┘               │
└───────────────────────────┼──────────────────┼──────────────────────┘
                            │                  │
                            │ HTTPS/REST API   │
                            ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS API SERVER                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Middleware Layer                                            │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │   │
│  │  │  Helmet  │→│   CORS   │→│ Rate     │→│  Auth    │       │   │
│  │  │ Security │ │ Policy   │ │ Limiter  │ │ (JWT)    │       │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                            │                                         │
│  ┌─────────────────────────▼─────────────────────────────────┐     │
│  │  Route Handlers                                            │     │
│  │  /auth  /customers  /products  /orders  /dashboard        │     │
│  └─────────────────────┬───────────────────────────────────┬─┘     │
│                        │                                     │       │
│  ┌─────────────────────▼─────────────────┐  ┌──────────────▼────┐  │
│  │  Service Layer                        │  │  Cache Layer      │  │
│  │  • Business Logic                     │  │  (Check Redis)    │  │
│  │  • Validation                         │  └─────────┬─────────┘  │
│  │  • Calculations                       │            │             │
│  └─────────────────────┬─────────────────┘            │             │
│                        │                               │             │
└────────────────────────┼───────────────────────────────┼─────────────┘
                         │                               │
         ┌───────────────▼───────────────┐   ┌──────────▼──────────┐
         │    MONGODB (Prisma ORM)       │   │   REDIS CACHE       │
         │                               │   │                     │
         │  ┌─────────────────────────┐  │   │  Key-Value Store   │
         │  │  Collections:           │  │   │  • dashboard:*     │
         │  │  • users                │  │   │  • products:*      │
         │  │  • customers            │  │   │  • orders:*        │
         │  │  • products             │  │   │  TTL: 5-60 min     │
         │  │  • orders               │  │   └────────────────────┘
         │  │  • transactions         │  │
         │  │  • daily_stats          │  │
         │  └─────────────────────────┘  │
         └───────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    BACKGROUND JOBS (node-cron)                       │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐           │
│  │ Daily Stats   │  │ Cache Warmup  │  │ Data Cleanup  │           │
│  │ (0 0 * * *)   │  │ (0 */6 * * *) │  │ (0 2 * * 0)   │           │
│  │ Midnight      │  │ Every 6 hours │  │ Sunday 2 AM   │           │
│  └───────────────┘  └───────────────┘  └───────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Request Flow: Dashboard Metrics

```
┌────────┐
│ Client │
└───┬────┘
    │ GET /api/v1/dashboard/metrics
    ▼
┌────────────────────┐
│ Express Middleware │
│ • Rate Limit Check │─────────┐
│ • Auth (JWT)       │         │ REJECT (429/401)
│ • CORS             │         ▼
└────────┬───────────┘   [Return Error]
         │ PASS
         ▼
┌────────────────────┐
│ Dashboard          │
│ Controller         │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Cache Service      │
│ Check Redis        │
└────────┬───────────┘
         │
    ┌────┴─────┐
    │          │
  CACHE      CACHE
   HIT       MISS
    │          │
    │          ▼
    │    ┌──────────────────┐
    │    │ Database Query   │
    │    │ • Calculate sum  │
    │    │ • Count records  │
    │    │ • Aggregate data │
    │    └────────┬─────────┘
    │             │
    │             ▼
    │    ┌──────────────────┐
    │    │ Store in Redis   │
    │    │ TTL: 300 seconds │
    │    └────────┬─────────┘
    │             │
    └─────────────┘
                  │
                  ▼
           ┌──────────────┐
           │ Format JSON  │
           │ Response     │
           └──────┬───────┘
                  │
                  ▼
           ┌──────────────┐
           │ Return to    │
           │ Client       │
           └──────────────┘

Response Time:
• Cache Hit:  ~5-10ms   🚀
• Cache Miss: ~100-500ms
```

---

### 3.3 Order Creation Flow (with Analytics Update)

```
┌────────┐
│ Client │
└───┬────┘
    │ POST /api/v1/orders
    │ Body: { customerId, items[], shippingAddress }
    ▼
┌────────────────────┐
│ Validation         │
│ (Zod Schema)       │
└────────┬───────────┘
         │ Valid
         ▼
┌────────────────────────────────────────────────────┐
│         BEGIN TRANSACTION (Prisma)                 │
│                                                    │
│  Step 1: Create Order                             │
│  ┌─────────────────────────────────────────────┐  │
│  │ order = await tx.order.create({             │  │
│  │   data: {                                   │  │
│  │     customerId, items, totalAmount, ...     │  │
│  │   }                                         │  │
│  │ })                                          │  │
│  └─────────────────────────────────────────────┘  │
│                      │                             │
│                      ▼                             │
│  Step 2: Update Customer Analytics                │
│  ┌─────────────────────────────────────────────┐  │
│  │ await tx.customer.update({                  │  │
│  │   where: { id: customerId },                │  │
│  │   data: {                                   │  │
│  │     totalOrders: { increment: 1 },          │  │
│  │     totalSpent: { increment: totalAmount }, │  │
│  │     lastOrderDate: new Date()               │  │
│  │   }                                         │  │
│  │ })                                          │  │
│  └─────────────────────────────────────────────┘  │
│                      │                             │
│                      ▼                             │
│  Step 3: Update Product Analytics                 │
│  ┌─────────────────────────────────────────────┐  │
│  │ for (item of order.items) {                 │  │
│  │   await tx.product.update({                 │  │
│  │     where: { id: item.productId },          │  │
│  │     data: {                                 │  │
│  │       totalSales: { increment: quantity },  │  │
│  │       totalRevenue: { increment: price },   │  │
│  │       stockQuantity: { decrement: qty }     │  │
│  │     }                                       │  │
│  │   })                                        │  │
│  │ }                                           │  │
│  └─────────────────────────────────────────────┘  │
│                      │                             │
│                      ▼                             │
│  Step 4: Create Transaction Record                │
│  ┌─────────────────────────────────────────────┐  │
│  │ await tx.transaction.create({               │  │
│  │   data: {                                   │  │
│  │     orderId, customerId, amount, ...        │  │
│  │   }                                         │  │
│  │ })                                          │  │
│  └─────────────────────────────────────────────┘  │
│                      │                             │
│         ┌────────────┴────────────┐                │
│         ▼                         ▼                │
│    ALL SUCCESS               ANY FAILURE           │
│    COMMIT                    ROLLBACK              │
└─────────┬────────────────────────┬─────────────────┘
          │                        │
          ▼                        ▼
   ┌──────────────┐        ┌──────────────┐
   │ Invalidate   │        │ Return Error │
   │ Cache        │        │ Response     │
   │ • customer:* │        └──────────────┘
   │ • dashboard:*│
   │ • products:* │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Return Order │
   │ Response     │
   └──────────────┘
```

---

### 3.4 Cron Job: Daily Stats Calculation

```
                    ┌─────────────────┐
                    │  Every Day      │
                    │  at Midnight    │
                    │  (0 0 * * *)    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Cron Trigger    │
                    │ Fires           │
                    └────────┬────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │  calculateDailyStats(yesterday)        │
        │                                        │
        │  Parallel Queries (Promise.all):      │
        │  ┌──────────────────────────────────┐ │
        │  │ 1. Total sales (SUM)             │ │
        │  │ 2. Total orders (COUNT)          │ │
        │  │ 3. Pending orders (COUNT)        │ │
        │  │ 4. Canceled orders (COUNT)       │ │
        │  │ 5. New customers (COUNT)         │ │
        │  │ 6. Product stats (COUNT * 3)     │ │
        │  │ 7. Sales by country (GROUP BY)   │ │
        │  └──────────────────────────────────┘ │
        └────────────────┬───────────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Aggregate       │
                │ Results         │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────────────┐
                │ Upsert DailyStats       │
                │ • date: yesterday       │
                │ • totalSales: X         │
                │ • totalOrders: Y        │
                │ • salesByCountry: {}    │
                └────────┬────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Invalidate      │
                │ Cache           │
                │ • dashboard:*   │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Log Success     │
                │ ✅ Complete     │
                └─────────────────┘

Execution Time: ~2-5 seconds
Frequency: Once per day
```

---

### 3.5 Cache Invalidation Strategy

```
┌─────────────────────────────────────────────────────────┐
│              WRITE OPERATIONS TRIGGER                    │
│                CACHE INVALIDATION                        │
└─────────────────────────────────────────────────────────┘

Event: NEW ORDER CREATED
   │
   ├─▶ Invalidate: dashboard:*
   │   (Dashboard metrics changed)
   │
   ├─▶ Invalidate: customer:{customerId}:*
   │   (Customer stats updated)
   │
   ├─▶ Invalidate: products:*
   │   (Product sales/inventory changed)
   │
   └─▶ Invalidate: orders:recent:*
       (Recent orders list updated)


Event: PRODUCT UPDATED
   │
   ├─▶ Invalidate: products:*
   │   (Product list changed)
   │
   └─▶ Invalidate: products:category:{categoryId}:*
       (Category listings changed)


Event: CUSTOMER UPDATED
   │
   └─▶ Invalidate: customer:{customerId}:*
       (Customer profile changed)


┌─────────────────────────────────────────────────────────┐
│            CACHE KEY HIERARCHY                          │
│                                                         │
│  dashboard:*                                           │
│    ├─ dashboard:metrics                               │
│    ├─ dashboard:weekly-report                         │
│    └─ dashboard:sales-by-country                      │
│                                                         │
│  products:*                                            │
│    ├─ products:list:1:20                              │
│    ├─ products:top:10                                 │
│    └─ products:category:{id}:1:20                     │
│                                                         │
│  customer:{id}:*                                       │
│    ├─ customer:123:profile                            │
│    └─ customer:123:orders                             │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Project Overview

### Current State

- **Backend Only**: No store-facing frontend (admin dashboard only)
- **Data Entry**: All data must be seeded via scripts
- **Database**: MongoDB with Prisma ORM
- **Caching**: Redis for server-side caching

### Architecture Goals

- High performance & scalability
- Production-grade code quality
- Efficient data aggregation & calculations
- Real-time analytics capabilities

---

## 5. Database Schema Design

### 5.1 Complete MongoDB Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// ========================================
// USER MANAGEMENT
// ========================================

enum UserRole {
  ADMIN
  USER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  password  String
  role      UserRole @default(USER)
  status    UserStatus @default(ACTIVE)

  // Profile Information
  avatar    String?
  phone     String?

  // Audit Fields
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime? // Soft delete

  // Timestamps for tracking
  lastLoginAt DateTime?

  // Refresh tokens for JWT
  refreshTokens RefreshToken[]

  @@map("users")
}

model RefreshToken {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  token     String   @unique
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
  @@map("refresh_tokens")
}

// ========================================
// CUSTOMER MANAGEMENT
// ========================================

enum CustomerStatus {
  ACTIVE
  INACTIVE
  BLOCKED
}

model Customer {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId

  // Basic Info
  firstName String
  lastName  String
  email     String   @unique
  phone     String?
  avatar    String?

  // Address Information
  addresses CustomerAddress[]

  // Analytics Fields (Denormalized for Performance)
  totalOrders   Int      @default(0)
  totalSpent    Float    @default(0)
  averageOrderValue Float @default(0)
  lastOrderDate DateTime?

  // Segmentation
  customerTier  String   @default("Bronze") // Bronze, Silver, Gold, Platinum
  status        CustomerStatus @default(ACTIVE)

  // Relations
  orders        Order[]

  // Audit Fields
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([email])
  @@index([status])
  @@index([totalSpent])
  @@map("customers")
}

type CustomerAddress {
  street      String
  city        String
  state       String
  country     String
  postalCode  String
  isDefault   Boolean @default(false)
  type        String  // "billing" or "shipping"
}

// ========================================
// PRODUCT CATALOG
// ========================================

enum ProductStatus {
  ACTIVE
  INACTIVE
  DRAFT
}

model Category {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   @unique
  slug        String   @unique
  description String?
  image       String?
  parentId    String?  @db.ObjectId

  // Nested categories
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  children    Category[] @relation("CategoryHierarchy")

  // Products in this category
  products    Product[]

  // Order for display
  sortOrder   Int      @default(0)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([slug])
  @@index([parentId])
  @@map("categories")
}

model Product {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId

  // Basic Info
  name        String
  slug        String   @unique
  sku         String   @unique
  description String

  // Pricing
  price       Float
  costPrice   Float?   // For profit calculation
  compareAtPrice Float? // For showing discounts

  // Inventory
  stockQuantity Int    @default(0)
  lowStockThreshold Int @default(10)

  // Media
  images      String[] // Array of image URLs
  thumbnail   String?

  // Category
  categoryId  String   @db.ObjectId
  category    Category @relation(fields: [categoryId], references: [id])

  // Tags for filtering
  tags        String[]

  // Analytics (Denormalized)
  totalSales  Int      @default(0)
  totalRevenue Float   @default(0)
  viewCount   Int      @default(0)

  // Status
  status      ProductStatus @default(DRAFT)
  isFeatured  Boolean  @default(false)

  // Relations
  orderItems  OrderItem[]

  // Audit
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([slug])
  @@index([sku])
  @@index([categoryId])
  @@index([status])
  @@index([totalSales])
  @@map("products")
}

// ========================================
// ORDER MANAGEMENT
// ========================================

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  PAYPAL
  STRIPE
  CASH_ON_DELIVERY
}

model Order {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  orderNumber String   @unique // e.g., "ORD-20231206-0001"

  // Customer
  customerId  String   @db.ObjectId
  customer    Customer @relation(fields: [customerId], references: [id])

  // Order Items
  items       OrderItem[]

  // Pricing (Denormalized for quick access)
  subtotal    Float
  taxAmount   Float
  shippingFee Float
  discount    Float    @default(0)
  totalAmount Float

  // Status
  orderStatus   OrderStatus   @default(PENDING)
  paymentStatus PaymentStatus @default(PENDING)
  paymentMethod PaymentMethod?

  // Shipping
  shippingAddress CustomerAddress?
  billingAddress  CustomerAddress?
  trackingNumber  String?

  // Metadata
  notes       String?
  ipAddress   String?
  userAgent   String?

  // Country for analytics
  country     String?

  // Timestamps
  paidAt      DateTime?
  shippedAt   DateTime?
  deliveredAt DateTime?
  canceledAt  DateTime?

  // Audit
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([orderNumber])
  @@index([customerId])
  @@index([orderStatus])
  @@index([paymentStatus])
  @@index([createdAt])
  @@index([country])
  @@map("orders")
}

model OrderItem {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId

  orderId   String   @db.ObjectId
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)

  productId String   @db.ObjectId
  product   Product  @relation(fields: [productId], references: [id])

  // Snapshot of product data at time of order
  productName String
  productSku  String
  productImage String?

  quantity  Int
  unitPrice Float
  totalPrice Float // quantity * unitPrice

  createdAt DateTime @default(now())

  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}

// ========================================
// ANALYTICS & REPORTS
// ========================================

// Daily aggregated stats for fast dashboard queries
model DailyStats {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  date      DateTime @unique

  // Sales metrics
  totalSales      Float
  totalOrders     Int
  pendingOrders   Int
  canceledOrders  Int

  // Customer metrics
  newCustomers    Int
  totalCustomers  Int

  // Product metrics
  totalProducts   Int
  stockProducts   Int
  outOfStock      Int

  // Revenue
  revenue         Float

  // By country
  salesByCountry  Json // { "USA": 30000, "Brazil": 25000, ... }

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([date])
  @@map("daily_stats")
}

// User activity tracking
model UserActivity {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  timestamp DateTime @default(now())

  // Activity metrics
  activeUsers Int
  pageViews   Int

  @@index([timestamp])
  @@map("user_activities")
}

// ========================================
// TRANSACTIONS
// ========================================

model Transaction {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  transactionNumber String @unique

  orderId         String   @db.ObjectId
  customerId      String   @db.ObjectId

  amount          Float
  paymentStatus   PaymentStatus
  paymentMethod   PaymentMethod

  // Payment gateway data
  gatewayTransactionId String?
  gatewayResponse      Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([transactionNumber])
  @@index([orderId])
  @@index([customerId])
  @@index([paymentStatus])
  @@index([createdAt])
  @@map("transactions")
}
```

### 5.2 Schema Design Principles

#### ✅ Denormalization Strategy

- **Customer Analytics**: Store `totalOrders`, `totalSpent`, `averageOrderValue` directly in Customer model
- **Product Analytics**: Store `totalSales`, `totalRevenue` in Product model
- **Order Totals**: Pre-calculate and store all order amounts
- **Daily Stats**: Aggregate daily to avoid expensive real-time queries

#### ✅ Why Denormalize?

1. **Performance**: Read-heavy dashboards benefit from pre-calculated values
2. **Reduced Joins**: MongoDB doesn't handle joins well
3. **Quick Queries**: Dashboard metrics load in milliseconds
4. **Cost-Effective**: Less database CPU usage

#### ❌ Don't Use Database Triggers in MongoDB

MongoDB doesn't have traditional triggers like SQL databases. Instead:

- Use **Application-Level Logic** (recommended)
- Use **Change Streams** for real-time updates (advanced)
- Use **Scheduled Jobs** for batch updates

---

## 6. Data Seeding Strategy

### 6.1 Seed File Structure

```
scripts/
├── seed.ts              # Main seed orchestrator
├── seeds/
│   ├── users.seed.ts    # Admin & user accounts
│   ├── customers.seed.ts
│   ├── categories.seed.ts
│   ├── products.seed.ts
│   ├── orders.seed.ts
│   ├── transactions.seed.ts
│   └── stats.seed.ts    # Daily stats & analytics
└── data/
    ├── customers.json   # Sample customer data
    ├── products.json
    └── orders.json
```

### 6.2 Master Seed Script

```typescript
// scripts/seed.ts
import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeds/users.seed";
import { seedCustomers } from "./seeds/customers.seed";
import { seedCategories } from "./seeds/categories.seed";
import { seedProducts } from "./seeds/products.seed";
import { seedOrders } from "./seeds/orders.seed";
import { seedTransactions } from "./seeds/transactions.seed";
import { seedDailyStats } from "./seeds/stats.seed";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Clear existing data (development only!)
    console.log("🗑️  Clearing existing data...");
    await prisma.transaction.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.dailyStats.deleteMany();
    await prisma.userActivity.deleteMany();

    // Seed in correct order (respect foreign keys)
    console.log("\n1️⃣  Seeding users...");
    await seedUsers(prisma);

    console.log("2️⃣  Seeding categories...");
    await seedCategories(prisma);

    console.log("3️⃣  Seeding products...");
    await seedProducts(prisma);

    console.log("4️⃣  Seeding customers...");
    await seedCustomers(prisma);

    console.log("5️⃣  Seeding orders...");
    await seedOrders(prisma);

    console.log("6️⃣  Seeding transactions...");
    await seedTransactions(prisma);

    console.log("7️⃣  Seeding daily stats...");
    await seedDailyStats(prisma);

    console.log("\n✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 6.3 Sample Seed Files

```typescript
// scripts/seeds/users.seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export async function seedUsers(prisma: PrismaClient) {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.createMany({
    data: [
      {
        email: "admin@dealport.com",
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        email: "user@dealport.com",
        name: "Regular User",
        password: hashedPassword,
        role: "USER",
        status: "ACTIVE",
      },
    ],
  });

  console.log("   ✓ Created 2 users");
}
```

```typescript
// scripts/seeds/customers.seed.ts
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export async function seedCustomers(prisma: PrismaClient) {
  const customers = [];

  for (let i = 0; i < 500; i++) {
    customers.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      avatar: faker.image.avatar(),
      addresses: [
        {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.helpers.arrayElement([
            "USA",
            "Brazil",
            "Australia",
            "UK",
            "Canada",
          ]),
          postalCode: faker.location.zipCode(),
          isDefault: true,
          type: "shipping",
        },
      ],
      status: "ACTIVE",
      customerTier: faker.helpers.arrayElement([
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
      ]),
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
    });
  }

  await prisma.customer.createMany({ data: customers });
  console.log(`   ✓ Created ${customers.length} customers`);
}
```

```typescript
// scripts/seeds/orders.seed.ts
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export async function seedOrders(prisma: PrismaClient) {
  const customers = await prisma.customer.findMany();
  const products = await prisma.product.findMany();

  for (const customer of customers.slice(0, 300)) {
    const numOrders = faker.number.int({ min: 1, max: 5 });

    for (let i = 0; i < numOrders; i++) {
      const numItems = faker.number.int({ min: 1, max: 4 });
      const orderProducts = faker.helpers.arrayElements(products, numItems);

      let subtotal = 0;
      const items = orderProducts.map((product) => {
        const quantity = faker.number.int({ min: 1, max: 3 });
        const totalPrice = product.price * quantity;
        subtotal += totalPrice;

        return {
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          productImage: product.thumbnail,
          quantity,
          unitPrice: product.price,
          totalPrice,
        };
      });

      const taxAmount = subtotal * 0.1;
      const shippingFee = 10;
      const totalAmount = subtotal + taxAmount + shippingFee;

      const createdAt = faker.date.between({
        from: "2024-01-01",
        to: new Date(),
      });

      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${faker.string
            .alphanumeric(4)
            .toUpperCase()}`,
          customerId: customer.id,
          subtotal,
          taxAmount,
          shippingFee,
          totalAmount,
          orderStatus: faker.helpers.arrayElement([
            "PENDING",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELED",
          ]),
          paymentStatus: faker.helpers.arrayElement([
            "PENDING",
            "PAID",
            "FAILED",
          ]),
          paymentMethod: faker.helpers.arrayElement([
            "CREDIT_CARD",
            "PAYPAL",
            "STRIPE",
          ]),
          country: customer.addresses[0]?.country || "USA",
          shippingAddress: customer.addresses[0],
          billingAddress: customer.addresses[0],
          createdAt,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productSku: item.productSku,
              productImage: item.productImage,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
        },
      });

      // Update customer analytics
      if (order.paymentStatus === "PAID") {
        await prisma.customer.update({
          where: { id: customer.id },
          data: {
            totalOrders: { increment: 1 },
            totalSpent: { increment: totalAmount },
            lastOrderDate: createdAt,
          },
        });

        // Update product analytics
        for (const item of items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              totalSales: { increment: item.quantity },
              totalRevenue: { increment: item.totalPrice },
              stockQuantity: { decrement: item.quantity },
            },
          });
        }
      }
    }
  }

  // Update average order values
  const customersWithOrders = await prisma.customer.findMany({
    where: { totalOrders: { gt: 0 } },
  });

  for (const customer of customersWithOrders) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        averageOrderValue: customer.totalSpent / customer.totalOrders,
      },
    });
  }

  console.log("   ✓ Created orders with analytics");
}
```

---

## 7. Performance Optimization

### 7.1 Database Indexing Strategy

**Already included in schema, but here's the rationale:**

```typescript
// Critical indexes for dashboard queries:

// 1. Customer lookups & analytics
@@index([email])           // Login & search
@@index([status])          // Filter active customers
@@index([totalSpent])      // Top customers query

// 2. Product queries
@@index([slug])            // Product detail pages
@@index([sku])             // Inventory management
@@index([categoryId])      // Category filtering
@@index([status])          // Active products only
@@index([totalSales])      // Best sellers

// 3. Order analytics
@@index([orderNumber])     // Quick lookups
@@index([customerId])      // Customer order history
@@index([orderStatus])     // Status filtering
@@index([paymentStatus])   // Payment tracking
@@index([createdAt])       // Date range queries
@@index([country])         // Geographic analytics

// 4. Time-series data
@@index([date])            // DailyStats queries
@@index([timestamp])       // UserActivity queries
```

### 7.2 Query Optimization Patterns

```typescript
// ❌ BAD: N+1 Query Problem
const orders = await prisma.order.findMany();
for (const order of orders) {
  const customer = await prisma.customer.findUnique({
    where: { id: order.customerId },
  });
  const items = await prisma.orderItem.findMany({
    where: { orderId: order.id },
  });
}

// ✅ GOOD: Include relations in single query
const orders = await prisma.order.findMany({
  include: {
    customer: {
      select: { id: true, firstName: true, lastName: true, email: true },
    },
    items: {
      include: {
        product: {
          select: { id: true, name: true, thumbnail: true },
        },
      },
    },
  },
  take: 20, // Pagination
  skip: 0,
  orderBy: { createdAt: "desc" },
});
```

### 7.3 Aggregation Pipelines

```typescript
// For complex analytics, use MongoDB aggregation
// Example: Sales by country

const salesByCountry = await prisma.$runCommandRaw({
  aggregate: "orders",
  pipeline: [
    {
      $match: {
        paymentStatus: "PAID",
        createdAt: {
          $gte: new Date("2024-12-01"),
          $lte: new Date("2024-12-31"),
        },
      },
    },
    {
      $group: {
        _id: "$country",
        totalSales: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    {
      $sort: { totalSales: -1 },
    },
  ],
  cursor: {},
});
```

### 7.4 Connection Pooling

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Connection pool settings (in .env)
// DATABASE_URL="mongodb://localhost:27017/dealport?poolSize=10&maxIdleTimeMS=60000"
```

---

## 8. Caching Strategy with Redis

### 8.1 Redis Setup

```typescript
// src/lib/redis.ts
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  db: 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redis;
```

### 8.2 Cache Patterns

#### Pattern 1: Cache-Aside (Most Common)

```typescript
// src/utils/cache.ts
import redis from "../lib/redis";

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600 // 1 hour default
): Promise<T> {
  // Try to get from cache
  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  // Cache miss - fetch from database
  const data = await fetcher();

  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
```

#### Pattern 2: Dashboard Metrics (5-minute cache)

```typescript
// src/services/dashboard.service.ts
import { getCached, invalidateCache } from "../utils/cache";
import { prisma } from "../lib/prisma";

export async function getDashboardMetrics() {
  return getCached(
    "dashboard:metrics",
    async () => {
      const [totalSales, totalOrders, pendingOrders, canceledOrders] =
        await Promise.all([
          // Total sales (last 30 days, paid orders)
          prisma.order.aggregate({
            where: {
              paymentStatus: "PAID",
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
            _sum: { totalAmount: true },
          }),

          // Total orders (last 30 days)
          prisma.order.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          }),

          // Pending orders
          prisma.order.count({ where: { orderStatus: "PENDING" } }),

          // Canceled orders
          prisma.order.count({ where: { orderStatus: "CANCELED" } }),
        ]);

      return {
        totalSales: totalSales._sum.totalAmount || 0,
        totalOrders,
        pendingOrders,
        canceledOrders,
      };
    },
    300 // 5 minutes
  );
}
```

#### Pattern 3: Product Listings (15-minute cache)

```typescript
export async function getProducts(page: number = 1, limit: number = 20) {
  const cacheKey = `products:list:${page}:${limit}`;

  return getCached(
    cacheKey,
    async () => {
      return prisma.product.findMany({
        where: { status: "ACTIVE", deletedAt: null },
        include: {
          category: { select: { id: true, name: true } },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { totalSales: "desc" },
      });
    },
    900 // 15 minutes
  );
}
```

#### Pattern 4: Top Sellers (1-hour cache)

```typescript
export async function getTopProducts(limit: number = 10) {
  return getCached(
    `products:top:${limit}`,
    async () => {
      return prisma.product.findMany({
        where: { status: "ACTIVE", deletedAt: null },
        orderBy: { totalSales: "desc" },
        take: limit,
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          thumbnail: true,
          totalSales: true,
          stockQuantity: true,
        },
      });
    },
    3600 // 1 hour
  );
}
```

### 8.3 Cache Invalidation Strategy

```typescript
// src/services/order.service.ts
import { invalidateCache } from "../utils/cache";

export async function createOrder(orderData: any) {
  const order = await prisma.order.create({ data: orderData });

  // Invalidate relevant caches
  await Promise.all([
    invalidateCache("dashboard:*"),
    invalidateCache("orders:*"),
    invalidateCache(`customer:${orderData.customerId}:*`),
  ]);

  return order;
}
```

### 8.4 Cache Keys Convention

```typescript
// Hierarchical key structure:
// {entity}:{action}:{identifier}:{params}

// Examples:
"dashboard:metrics"; // Dashboard overview
"dashboard:weekly-report"; // Weekly stats
"customer:123abc:orders"; // Customer orders
"customer:123abc:profile"; // Customer profile
"products:list:1:20"; // Products page 1, 20 items
"products:top:10"; // Top 10 products
"products:category:electronics:1:20"; // Electronics, page 1
"orders:recent:10"; // Recent 10 orders
"stats:daily:2024-12-06"; // Daily stats for specific date
```

---

## 9. Calculation Strategies

### 9.1 The Big Question: Manual Updates vs. Triggers?

**Answer: Use Application-Level Logic (No Triggers)**

#### Why NOT Database Triggers in MongoDB?

1. MongoDB doesn't have traditional SQL triggers
2. Change Streams are complex and add overhead
3. Application logic is easier to test and debug
4. More control over when/how updates happen

### 9.2 Application-Level Calculation Pattern

```typescript
// src/services/order.service.ts
import { prisma } from "../lib/prisma";

export async function processOrder(orderId: string) {
  // Use transaction to ensure data consistency
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error("Order not found");

    // 1. Update customer analytics
    await tx.customer.update({
      where: { id: order.customerId },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: order.totalAmount },
        lastOrderDate: new Date(),
      },
    });

    // Calculate average order value
    const customer = await tx.customer.findUnique({
      where: { id: order.customerId },
    });

    if (customer) {
      await tx.customer.update({
        where: { id: order.customerId },
        data: {
          averageOrderValue: customer.totalSpent / customer.totalOrders,
        },
      });
    }

    // 2. Update product analytics for each item
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          totalSales: { increment: item.quantity },
          totalRevenue: { increment: item.totalPrice },
          stockQuantity: { decrement: item.quantity },
        },
      });
    }

    // 3. Update order status
    await tx.order.update({
      where: { id: orderId },
      data: {
        orderStatus: "PROCESSING",
        paymentStatus: "PAID",
        paidAt: new Date(),
      },
    });

    return order;
  });
}
```

### 9.3 Batch Update Strategy

For updating analytics in bulk (e.g., daily stats):

```typescript
// src/jobs/daily-stats.job.ts
import { prisma } from "../lib/prisma";

export async function calculateDailyStats(date: Date) {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  // Get all metrics in parallel
  const [
    totalSales,
    totalOrders,
    pendingOrders,
    canceledOrders,
    newCustomers,
    totalCustomers,
    productStats,
    salesByCountry,
  ] = await Promise.all([
    // Total sales
    prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      _sum: { totalAmount: true },
    }),

    // Total orders
    prisma.order.count({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
    }),

    // Pending orders
    prisma.order.count({
      where: {
        orderStatus: "PENDING",
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    }),

    // Canceled orders
    prisma.order.count({
      where: {
        orderStatus: "CANCELED",
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    }),

    // New customers
    prisma.customer.count({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
    }),

    // Total customers (active)
    prisma.customer.count({
      where: { status: "ACTIVE", deletedAt: null },
    }),

    // Product statistics
    Promise.all([
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.product.count({ where: { stockQuantity: { gt: 0 } } }),
      prisma.product.count({ where: { stockQuantity: 0 } }),
    ]),

    // Sales by country (using aggregation)
    prisma.order.groupBy({
      by: ["country"],
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      _sum: { totalAmount: true },
    }),
  ]);

  const [totalProducts, stockProducts, outOfStock] = productStats;

  // Format sales by country
  const salesByCountryObj = salesByCountry.reduce((acc, item) => {
    if (item.country) {
      acc[item.country] = item._sum.totalAmount || 0;
    }
    return acc;
  }, {} as Record<string, number>);

  // Upsert daily stats
  await prisma.dailyStats.upsert({
    where: { date: startOfDay },
    update: {
      totalSales: totalSales._sum.totalAmount || 0,
      totalOrders,
      pendingOrders,
      canceledOrders,
      newCustomers,
      totalCustomers,
      totalProducts,
      stockProducts,
      outOfStock,
      revenue: totalSales._sum.totalAmount || 0,
      salesByCountry: salesByCountryObj,
    },
    create: {
      date: startOfDay,
      totalSales: totalSales._sum.totalAmount || 0,
      totalOrders,
      pendingOrders,
      canceledOrders,
      newCustomers,
      totalCustomers,
      totalProducts,
      stockProducts,
      outOfStock,
      revenue: totalSales._sum.totalAmount || 0,
      salesByCountry: salesByCountryObj,
    },
  });

  console.log(`✅ Daily stats calculated for ${startOfDay.toISOString()}`);
}
```

### 9.4 Scheduled Jobs with node-cron

```typescript
// src/jobs/scheduler.ts
import cron from "node-cron";
import { calculateDailyStats } from "./daily-stats.job";
import { invalidateCache } from "../utils/cache";

export function startScheduledJobs() {
  // Run daily stats calculation at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("🕐 Running daily stats calculation...");
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await calculateDailyStats(yesterday);
    await invalidateCache("dashboard:*");
  });

  // Clear stale cache every hour
  cron.schedule("0 * * * *", async () => {
    console.log("🧹 Clearing stale cache...");
    // Implement selective cache clearing
  });

  console.log("✅ Scheduled jobs started");
}
```

---

## 10. MongoDB Best Practices

### 10.1 Document Size Limits

- **Max document size**: 16MB
- **Embedded arrays**: Avoid unbounded arrays (e.g., don't embed all orders in customer)
- **Solution**: Use references (like we did with `orders: Order[]` relation)

### 7.2 Indexing Guidelines

✅ **DO:**

- Index fields used in queries, sorts, and joins
- Use compound indexes for multi-field queries
- Monitor index usage with `explain()`

❌ **DON'T:**

- Over-index (each index has write cost)
- Index fields that are rarely queried
- Create indexes on high-cardinality fields unnecessarily

### 10.3 Query Performance

```typescript
// Use projection to limit returned fields
const customers = await prisma.customer.findMany({
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    totalSpent: true,
    // Don't fetch large fields like addresses if not needed
  },
});

// Use pagination ALWAYS
const page = 1;
const limit = 20;
const products = await prisma.product.findMany({
  take: limit,
  skip: (page - 1) * limit,
});
```

---

## 11. Production-Grade Approaches

### 11.1 Environment Configuration

```bash
# .env.example
NODE_ENV=production

# Database
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/dealport?retryWrites=true&w=majority"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_REFRESH_SECRET=another_secret_for_refresh_tokens
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=5000
CORS_ORIGIN=https://yourdomain.com

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info
```

### 11.2 Error Handling Middleware

```typescript
// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Log unexpected errors
  console.error("💥 UNEXPECTED ERROR:", err);

  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
```

### 11.3 Request Validation

```typescript
// src/validators/order.validator.ts
import { z } from "zod";

export const createOrderSchema = z.object({
  customerId: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    postalCode: z.string(),
  }),
});

// Middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};
```

### 11.4 Rate Limiting

```typescript
// src/middlewares/rate-limit.middleware.ts
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../lib/redis";

export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: "rate_limit:",
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});

export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: "rate_limit:auth:",
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  message: "Too many login attempts, please try again later.",
});
```

### 11.5 Logging Strategy

```typescript
// src/lib/logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Write all logs to console in development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Write all logs to file in production
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
```

### 11.6 Health Check Endpoint

```typescript
// src/routes/health.route.ts
import { Router } from "express";
import { prisma } from "../lib/prisma";
import redis from "../lib/redis";

const router = Router();

router.get("/health", async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connection
    await redis.ping();

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        redis: "connected",
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

export default router;
```

---

## 12. API Design & Implementation

### 12.1 RESTful Endpoint Structure

```
GET    /api/v1/dashboard/metrics           # Dashboard overview
GET    /api/v1/dashboard/weekly-report     # Weekly stats
GET    /api/v1/dashboard/top-products      # Top selling products
GET    /api/v1/dashboard/sales-by-country  # Geographic sales

GET    /api/v1/customers                   # List customers
GET    /api/v1/customers/:id               # Get customer
POST   /api/v1/customers                   # Create customer
PATCH  /api/v1/customers/:id               # Update customer
DELETE /api/v1/customers/:id               # Soft delete

GET    /api/v1/products                    # List products
GET    /api/v1/products/:id                # Get product
POST   /api/v1/products                    # Create product
PATCH  /api/v1/products/:id                # Update product
DELETE /api/v1/products/:id                # Soft delete

GET    /api/v1/orders                      # List orders
GET    /api/v1/orders/:id                  # Get order
POST   /api/v1/orders                      # Create order
PATCH  /api/v1/orders/:id/status           # Update status
DELETE /api/v1/orders/:id                  # Cancel order

GET    /api/v1/transactions                # List transactions
GET    /api/v1/transactions/:id            # Get transaction
```

### 12.2 Response Format Standard

```typescript
// Success response
{
  "status": "success",
  "data": {
    // Your data here
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25
  }
}

// Error response
{
  "status": "error",
  "message": "Resource not found",
  "code": "RESOURCE_NOT_FOUND"
}
```

---

## 13. Monitoring & Observability

### 13.1 Application Metrics

```typescript
// Track key metrics
import prometheus from "prom-client";

const register = new prometheus.Registry();

// HTTP request duration
const httpDuration = new prometheus.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// Database query duration
const dbDuration = new prometheus.Histogram({
  name: "db_query_duration_seconds",
  help: "Duration of database queries in seconds",
  labelNames: ["operation"],
  registers: [register],
});

// Cache hit/miss ratio
const cacheHits = new prometheus.Counter({
  name: "cache_hits_total",
  help: "Total number of cache hits",
  registers: [register],
});

const cacheMisses = new prometheus.Counter({
  name: "cache_misses_total",
  help: "Total number of cache misses",
  registers: [register],
});
```

### 10.2 Performance Checklist

✅ **Database:**

- [ ] All queries have appropriate indexes
- [ ] Use pagination for list endpoints
- [ ] Projection used to limit returned fields
- [ ] Avoid N+1 queries with proper includes
- [ ] Connection pooling configured

✅ **Caching:**

- [ ] Redis configured and running
- [ ] Dashboard metrics cached (5-10 min TTL)
- [ ] Product listings cached (15 min TTL)
- [ ] Cache invalidation strategy in place
- [ ] Cache hit/miss monitoring

✅ **Application:**

- [ ] Request validation with Zod
- [ ] Error handling middleware
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Helmet security headers
- [ ] Request/response compression (gzip)

✅ **Monitoring:**

- [ ] Health check endpoint
- [ ] Logging configured (Winston/Pino)
- [ ] Error tracking (Sentry)
- [ ] Performance metrics (Prometheus)
- [ ] Uptime monitoring

---

## 11. Development Workflow

### Step-by-Step Implementation Plan

#### Phase 1: Setup & Foundation (Day 1-2)

1. Initialize project with dependencies
2. Configure MongoDB connection
3. Setup Redis
4. Create Prisma schema
5. Run migrations: `npx prisma db push`
6. Test connections

#### Phase 2: Data Seeding (Day 2-3)

1. Create seed scripts for all entities
2. Generate realistic test data with Faker
3. Run seed: `npm run seed`
4. Verify data in MongoDB Compass

#### Phase 3: Core API (Day 3-5)

1. Implement auth endpoints (login/register)
2. Create customer CRUD endpoints
3. Create product CRUD endpoints
4. Create order endpoints with analytics
5. Test all endpoints with Postman/Thunder Client

#### Phase 4: Dashboard Analytics (Day 5-7)

1. Implement dashboard metrics endpoint
2. Add Redis caching
3. Create daily stats calculation job
4. Test performance with large datasets

#### Phase 5: Optimization & Polish (Day 7-10)

1. Add rate limiting
2. Implement error handling
3. Add request validation
4. Setup logging
5. Performance testing & tuning
6. Security audit

---

## 12. Quick Commands Reference

```bash
# Install dependencies
npm install

# Install production dependencies
npm install express @prisma/client dotenv bcrypt jsonwebtoken
npm install ioredis zod helmet cors compression express-rate-limit

# Install dev dependencies
npm install -D typescript tsx @types/node @types/express prisma
npm install -D @types/bcrypt @types/jsonwebtoken @faker-js/faker

# Prisma commands
npx prisma init                    # Initialize Prisma
npx prisma generate                # Generate Prisma Client
npx prisma db push                 # Push schema to MongoDB
npx prisma studio                  # Open Prisma Studio GUI

# Seed database
npm run seed

# Development
npm run dev                        # Start dev server with watch mode

# Production
npm run build                      # Compile TypeScript
npm start                          # Run production server
```

---

## 13. Key Takeaways

### ✅ DO This:

1. **Denormalize analytics data** (totalOrders, totalSpent in Customer)
2. **Use application-level logic** for calculations (not triggers)
3. **Cache aggressively** with Redis (5-60 min TTLs)
4. **Index strategically** (email, status, createdAt, country)
5. **Paginate everything** (never return unbounded arrays)
6. **Pre-calculate daily stats** (scheduled jobs)
7. **Use transactions** for multi-document updates
8. **Monitor performance** (logs, metrics, health checks)

### ❌ DON'T Do This:

1. Don't use MongoDB triggers/change streams for simple updates
2. Don't query without indexes
3. Don't return full documents when you need only few fields
4. Don't skip input validation
5. Don't ignore cache invalidation
6. Don't hardcode values (use environment variables)
7. Don't expose sensitive data in API responses

---

## 14. Performance Targets

### Goal Metrics:

- **Dashboard load**: < 200ms (with cache)
- **API response time**: < 100ms (cached), < 500ms (uncached)
- **Database queries**: < 50ms (indexed queries)
- **Cache hit ratio**: > 80%
- **Concurrent users**: 1000+ (with Redis & connection pooling)

### Load Testing:

```bash
# Install k6 for load testing
brew install k6  # macOS

# Example load test script (load-test.js)
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = http.get('http://localhost:5000/api/v1/dashboard/metrics');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}

# Run load test
k6 run load-test.js
```

---

## 15. Deployment Checklist

### Before Going Live:

- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster setup (production tier)
- [ ] Redis Cloud/ElastiCache configured
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting enabled
- [ ] Error tracking (Sentry) configured
- [ ] Logging configured
- [ ] Health check endpoint tested
- [ ] Backup strategy in place
- [ ] Monitoring alerts setup
- [ ] Documentation updated
- [ ] Load testing completed
- [ ] Security audit passed

---

## 16. Resources & Further Reading

### Documentation:

- [Prisma Docs](https://www.prisma.io/docs)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)
- [Redis Caching Patterns](https://redis.io/docs/manual/patterns/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)

### Tools:

- **MongoDB Compass**: Visual database explorer
- **Prisma Studio**: Database GUI (`npx prisma studio`)
- **RedisInsight**: Redis GUI
- **Postman/Thunder Client**: API testing
- **k6**: Load testing

---

## Questions to Consider

1. **How often should daily stats be recalculated?**

   - Recommendation: Run at midnight + on-demand API endpoint

2. **Should we use MongoDB transactions for all writes?**

   - Use for multi-document updates only (has performance cost)

3. **Cache TTL strategy?**

   - Dashboard: 5 minutes
   - Products: 15 minutes
   - Static data: 1 hour

4. **When to invalidate cache?**
   - On every write operation to affected entities
   - Pattern-based invalidation (e.g., `customer:*`)

---

**Good luck building your dashboard! 🚀**

This guide covers everything you need for production-grade performance. Start with the schema, seed your data, implement caching, and monitor everything. You've got this!
