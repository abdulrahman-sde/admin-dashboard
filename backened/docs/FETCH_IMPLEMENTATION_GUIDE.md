# 🧑‍💻 Production-Ready Fetch Logic: Orders vs. Products

This document compares and extensively explains the robust implementation pattern used for both **Orders** and **Products** API endpoints. Both now share a unified, type-safe architecture designed for complex Admin Dashboards.

---

## 1. The Architecture Pattern

We moved away from ad-hoc query parsing (`req.query.status`) to a strictly typed pipeline:

**Pipeline:**

1.  **Controller**: Receives `req.query` (strings).
2.  **Validator (Zod)**: Coerces strings to numbers/booleans, validates enums, and defaults values. Returns a typed object.
3.  **Service**: Receives the typed object. Builds a dynamic Prisma `WHERE` clause using the `andConditions` array pattern.
4.  **Repository**: Executes the query + count.
5.  **Response**: Returns standard `{ data, meta }` structure.

---

## 2. Deep Dive: Orders Implementation

**Goal**: Support complex Admin grid with tabs, date ranges, and cross-entity search.

### A. The Validator (`order-query.validator.ts`)

- **Pagination**: `page`, `limit` (Coerced from string to int).
- **Search**: Universal search bar.
- **Status**: Strongly typed `FulfillmentStatus` Enum.
- **Dates**: `startDate`, `endDate`.

### B. The Service Logic (`getOrders`)

The most complex part here is the **Search** logic.

```typescript
// Cross-Entity Search (OR logic)
where.OR = [
  { orderNumber: { contains: search } }, // Check Order ID
  { customer: { firstName: { contains: search } } }, // Check Customer Name
  { customer: { email: { contains: search } } }, // Check Customer Email
];
```

This allows an admin to type "John" and find John's orders, OR type "ORD-123" and find that specific order.

**The `andConditions` Pattern:**
Instead of fighting with Prisma's strict types, we build an array:

```typescript
const andConditions: Prisma.OrderWhereInput[] = [];

if (status) andConditions.push({ fulfillmentStatus: status });
if (date) andConditions.push({ createdAt: { gte: date } });

// Final assignment avoids 'any' casting errors
if (andConditions.length > 0) where.AND = andConditions;
```

---

## 3. Deep Dive: Products Implementation (Refactored)

**Goal**: Support dashboard product list with badges (Featured, low stock) and tab counts.

### A. The Validator (`product.validator.ts`)

- **Boolean Coercion**: Handling `?isFeatured=true`. Zod `preprocess` converts string "true" to boolean `true`.
- **Sort**: `sortBy` (price, sales, stock).
- **Stock Aliases**: Maps UI concepts (`LOW_STOCK`) to DB queries (`stock <= 10`).

### B. The Service Logic (`getProducts`)

We implemented "Badges Calculation" (Meta Counts) to power the dashboard tabs.

```typescript
// Parallel Meta Fetching
const [all, featured, onSale] = await Promise.all([
  prisma.product.count(),
  prisma.product.count({ where: { isFeatured: true } }),
  prisma.product.count({ where: { discountPrice: { gt: 0 } } }),
]);
```

This single API call powers the entire dashboard header:

- Active (100)
- Featured (25)
- On Sale (10)

---

## 4. Key Takeaways for Frontend Integration

### URL Query Params to Use

**Fetch Completed Orders for Last 7 Days:**
`GET /api/admin/orders?fulfillmentStatus=DELIVERED&startDate=2023-10-01&limit=20`

**Search Orders by Customer Name:**
`GET /api/admin/orders?search=John%20Doe`

**Fetch Low Stock Products:**
`GET /api/admin/products?stockStatus=LOW_STOCK`

**Sort Products by Sales:**
`GET /api/admin/products?sortBy=totalSales&sortOrder=desc`

This architecture ensures that no matter what the Admin User clicks (Filter, Sort, Search), the backend handles it safely and efficiently.
