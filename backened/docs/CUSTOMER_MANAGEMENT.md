# Customer Authentication & Management

## 🎯 Key Difference

| Admin (User)              | Customer                                 |
| ------------------------- | ---------------------------------------- |
| **Role-Based Access**     | **Identity-Based Access**                |
| ADMIN can delete products | Customers can only access THEIR OWN data |
| STAFF can view orders     | A customer can only see THEIR orders     |
| Needs RBAC                | No roles needed!                         |

---

## 🔐 Customer Authentication Flow

### 1. **Guest Customer (No Auth)**

```typescript
// Customer adds items to cart without account
POST /api/cart/add
{
  "sessionId": "uuid-from-browser",  // Generated client-side
  "productId": "123",
  "quantity": 2
}

// Checkout as guest
POST /api/orders
{
  "email": "guest@example.com",
  "items": [...],
  "shippingAddress": {...}
}
// Creates customer with password = null, isGuest = true
```

### 2. **Registered Customer**

```typescript
// Register
POST /api/customers/register
{
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

// Login
POST /api/customers/login
{
  "email": "john@example.com",
  "password": "password123"
}
// Returns JWT token
```

### 3. **Convert Guest to Registered**

```typescript
// After guest checkout, customer can create account
POST /api/customers/create-account
{
  "email": "guest@example.com",  // Email from guest order
  "password": "newpassword123"
}
// Updates customer: password = hashed, isGuest = false
```

---

## 🛡️ Customer Authorization (Access Control)

**Rule**: Customers can only access THEIR OWN data

### Authentication Middleware

```typescript
// middleware/customer-auth.middleware.ts
import { verifyToken } from "../lib/jwt.js";
import { UnauthorizedError } from "../utils/errors.js";
import type { CustomerAuthRequest } from "../types/auth.types.js";
import type { Response, NextFunction } from "express";

export const authenticateCustomer = async (
  req: CustomerAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = verifyToken(token);

    // Verify it's a customer token (not admin)
    if (payload.type !== "customer") {
      throw new UnauthorizedError("Invalid token type");
    }

    // Attach customer info to request
    req.customer = {
      id: payload.customerId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      isGuest: payload.isGuest || false,
    };

    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};
```

### Ownership Verification

```typescript
// middleware/verify-ownership.middleware.ts
import { ForbiddenError, NotFoundError } from "../utils/errors.js";
import { prisma } from "../lib/prisma.js";
import type { CustomerAuthRequest } from "../types/auth.types.js";
import type { Response, NextFunction } from "express";

export const verifyOrderOwnership = async (
  req: CustomerAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  const customerId = req.customer?.id;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { customerId: true },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (order.customerId !== customerId) {
    throw new ForbiddenError("You don't have access to this order");
  }

  next();
};
```

---

## 📁 Customer API Endpoints

### Customer Routes Structure

```typescript
// routes/customers/
├── auth.route.ts         // Register, login, logout
├── profile.route.ts      // Get/update profile
├── orders.route.ts       // View own orders
├── addresses.route.ts    // Manage addresses
└── index.ts
```

### Example Routes

```typescript
// routes/customers/auth.route.ts
import { Router } from "express";
import * as customerAuthController from "../../controllers/customers/auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  registerCustomerSchema,
  loginCustomerSchema,
} from "../../validators/customers.validator.js";

const router = Router();

router.post(
  "/register",
  validate(registerCustomerSchema),
  customerAuthController.register
);
router.post(
  "/login",
  validate(loginCustomerSchema),
  customerAuthController.login
);
router.post("/logout", customerAuthController.logout);

export default router;
```

```typescript
// routes/customers/orders.route.ts
import { Router } from "express";
import { authenticateCustomer } from "../../middleware/customer-auth.middleware.js";
import { verifyOrderOwnership } from "../../middleware/verify-ownership.middleware.js";
import * as ordersController from "../../controllers/customers/orders.controller.js";

const router = Router();

// All routes require customer authentication
router.use(authenticateCustomer);

// Customer can view their own orders
router.get("/", ordersController.getMyOrders);

// Customer can view specific order (with ownership check)
router.get("/:id", verifyOrderOwnership, ordersController.getOrderById);

export default router;
```

---

## 🎯 Updated JWT Token Format

### Admin Token

```typescript
{
  userId: "user123",
  email: "admin@company.com",
  role: "ADMIN",
  type: "user"  // ← Identifies as admin token
}
```

### Customer Token

```typescript
{
  customerId: "cust456",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  isGuest: false,
  type: "customer"  // ← Identifies as customer token
}
```

### Updated JWT Helper

```typescript
// lib/jwt.ts
import jwt from "jsonwebtoken";

export interface UserJWTPayload {
  userId: string;
  email: string;
  role: string;
  type: "user";
}

export interface CustomerJWTPayload {
  customerId: string;
  email: string;
  firstName: string;
  lastName: string;
  isGuest: boolean;
  type: "customer";
}

export type JWTPayload = UserJWTPayload | CustomerJWTPayload;

export const generateCustomerTokens = (customer: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isGuest: boolean;
}) => {
  const payload: CustomerJWTPayload = {
    customerId: customer.id,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    isGuest: customer.isGuest,
    type: "customer",
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { customerId: customer.id, type: "customer" },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const generateUserTokens = (user: {
  id: string;
  email: string;
  role: string;
}) => {
  const payload: UserJWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: "user",
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { userId: user.id, type: "user" },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
```

---

## 📊 API Structure

### Admin API (Protected by RBAC)

```
/api/admin/
  ├── /auth          (login)
  ├── /users         (manage admin users)
  ├── /products      (CRUD products)
  ├── /orders        (view ALL orders)
  ├── /customers     (view ALL customers)
  └── /analytics     (dashboard stats)
```

### Customer API (Protected by Customer Auth)

```
/api/customers/
  ├── /auth           (register, login)
  ├── /profile        (get/update MY profile)
  ├── /orders         (view MY orders)
  ├── /addresses      (manage MY addresses)
  └── /reviews        (MY reviews)
```

### Public API (No Auth)

```
/api/
  ├── /products       (browse products)
  ├── /categories     (browse categories)
  └── /cart           (guest cart using sessionId)
```

---

## 🔄 Complete Example Flow

### Customer Registration

```typescript
// controllers/customers/auth.controller.ts
import { hashPassword } from "../../lib/hash.js";
import { generateCustomerTokens } from "../../lib/jwt.js";
import { prisma } from "../../lib/prisma.js";
import { successResponse } from "../../utils/response.js";
import { ConflictError } from "../../utils/errors.js";
import type { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  // Check if customer exists
  const exists = await prisma.customer.findUnique({ where: { email } });
  if (exists) {
    throw new ConflictError("Email already registered");
  }

  // Create customer
  const customer = await prisma.customer.create({
    data: {
      email,
      firstName,
      lastName,
      password: await hashPassword(password),
      isGuest: false, // Registered customer
      emailVerified: false,
    },
  });

  // Generate tokens
  const tokens = generateCustomerTokens({
    id: customer.id,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    isGuest: customer.isGuest,
  });

  // Remove password from response
  const { password: _, ...safeCustomer } = customer;

  res.status(201).json(
    successResponse(
      {
        customer: safeCustomer,
        ...tokens,
      },
      "Registration successful"
    )
  );
};
```

### View Customer's Own Orders

```typescript
// controllers/customers/orders.controller.ts
import { prisma } from "../../lib/prisma.js";
import { successResponse, paginatedResponse } from "../../utils/response.js";
import type { CustomerAuthRequest } from "../../types/auth.types.js";
import type { Response } from "express";

export const getMyOrders = async (req: CustomerAuthRequest, res: Response) => {
  const customerId = req.customer?.id; // From auth middleware
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Only fetch THIS customer's orders
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { customerId }, // ← Security: only their orders
      skip,
      take: limit,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where: { customerId } }),
  ]);

  res.json(paginatedResponse(orders, { page, limit, total }));
};

export const getOrderById = async (req: CustomerAuthRequest, res: Response) => {
  const { id } = req.params;

  // verifyOrderOwnership middleware already checked ownership
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  res.json(successResponse(order));
};
```

---

## ✅ Summary

### Customers Don't Need Roles!

**Access Control for Customers**:

- ✅ Can only view THEIR data (orders, profile, addresses)
- ✅ Can only modify THEIR data
- ✅ Cannot see other customers' data
- ✅ No admin panel access

**Implementation**:

1. Separate authentication middleware for customers
2. Verify ownership (customer can only access their own resources)
3. Different JWT token structure (type: "customer")
4. Separate API endpoints (`/api/customers/*`)

**No RBAC needed** - just ensure customers can only access their own data! 🎯
