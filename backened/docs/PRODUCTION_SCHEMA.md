# Production-Ready Schema Design

## 🎯 Clear Separation

### **User** = Admin Dashboard Staff

- Admin panel access
- Manage products, orders, customers
- Role-based permissions (ADMIN, MANAGER, STAFF)

### **Customer** = Store Buyers

- Buy products
- Can be guest (no password) or registered (with password)
- No admin panel access

---

## 📊 Proposed Production Schema

```prisma
// ========================================
// ADMIN USERS (Dashboard Access)
// ========================================

enum UserRole {
  SUPER_ADMIN  // Full system access
  ADMIN        // Most features
  MANAGER      // Limited admin features
  STAFF        // View-only or limited actions
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

model User {
  id        String     @id @default(auto()) @map("_id") @db.ObjectId
  email     String     @unique
  firstName String
  lastName  String
  password  String     // Always required for admin users

  // RBAC
  role      UserRole   @default(STAFF)
  status    UserStatus @default(ACTIVE)

  // Permissions (optional - for fine-grained control)
  permissions String[]  // ["products.create", "orders.view", etc.]

  // Profile
  avatar      String?
  phone       String?
  department  String?

  // Audit
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime? // Soft delete
  lastLoginAt DateTime?
  createdBy   String?   @db.ObjectId  // Who created this user

  @@map("users")
}

// ========================================
// CUSTOMERS (Store Buyers)
// ========================================

enum CustomerStatus {
  ACTIVE
  INACTIVE
  BLOCKED
}

model Customer {
  id String @id @default(auto()) @map("_id") @db.ObjectId

  // Basic Info
  firstName String
  lastName  String
  email     String  @unique
  password  String? // ✅ Optional - null for guest customers
  phone     String?
  avatar    String?

  // Account Type
  isGuest       Boolean @default(true)  // true = guest, false = registered
  emailVerified Boolean @default(false)
  status        CustomerStatus @default(ACTIVE)

  // Address
  addresses CustomerAddress[]

  // Analytics (Denormalized for performance)
  totalOrders       Int       @default(0)
  totalSpent        Float     @default(0)
  averageOrderValue Float     @default(0)
  lastOrderDate     DateTime?
  customerTier      String    @default("Bronze") // Bronze, Silver, Gold, Platinum

  // Relations
  orders   Order[]
  sessions Session[]

  // Audit
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@index([isGuest])
  @@index([status])
  @@index([totalSpent])
  @@index([email])
  @@map("customers")
}

type CustomerAddress {
  street     String
  city       String
  state      String
  country    String
  postalCode String
  isDefault  Boolean @default(false)
  type       String  // "billing" or "shipping"
}

// ========================================
// RBAC Permissions (Optional but Recommended)
// ========================================

model Permission {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   @unique  // "products.create"
  description String
  category    String   // "products", "orders", "customers"

  createdAt DateTime @default(now())

  @@map("permissions")
}

// Role-Permission mapping (if you want super flexible RBAC)
model RolePermission {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  role         UserRole
  permissionId String   @db.ObjectId

  @@unique([role, permissionId])
  @@map("role_permissions")
}
```

---

## 🔑 Key Design Decisions

### 1. **Separate Models**

✅ **User** - Admin dashboard  
✅ **Customer** - Store buyers  
❌ No mixing - they're completely different domains

### 2. **Role Hierarchy**

```
SUPER_ADMIN > ADMIN > MANAGER > STAFF
```

### 3. **Guest Customers**

```typescript
// Guest customer (checkout without account)
{
  email: "guest@example.com",
  firstName: "John",
  lastName: "Doe",
  password: null,        // ✅ No password
  isGuest: true          // ✅ Guest flag
}

// Registered customer
{
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  password: "hashed...", // ✅ Has password
  isGuest: false         // ✅ Registered account
}
```

---

## 🎯 RBAC Implementation

### Option 1: Simple Role-Based (Recommended for Start)

```typescript
// middleware/rbac.middleware.ts
import { UserRole } from "@prisma/client";
import type { AuthRequest } from "../types/auth.types.js";
import { Response, NextFunction } from "express";
import { ForbiddenError } from "../utils/errors.js";

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole as UserRole)) {
      throw new ForbiddenError("Insufficient permissions");
    }

    next();
  };
};

// Usage
router.delete(
  "/products/:id",
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  deleteProduct
);
```

### Option 2: Permission-Based (Advanced)

```typescript
export const requirePermission = (...permissions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { permissions: true, role: true },
    });

    const hasPermission = permissions.some((p) =>
      user?.permissions.includes(p)
    );

    if (!hasPermission) {
      throw new ForbiddenError("Insufficient permissions");
    }

    next();
  };
};

// Usage
router.post(
  "/products",
  authenticate,
  requirePermission("products.create"),
  createProduct
);
```

---

## 📝 Updated Types

```typescript
// types/auth.types.ts
import type { User, Customer, UserRole } from "@prisma/client";

// Admin user request
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    permissions?: string[];
  };
}

// Customer request
export interface CustomerAuthRequest extends Request {
  customer?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isGuest: boolean;
  };
}

// Generic token response
export interface TokenResponse<T> {
  data: T;
  accessToken: string;
  refreshToken: string;
}

// Safe types (no password)
export type SafeUser = Omit<User, "password">;
export type SafeCustomer = Omit<Customer, "password">;

// Auth responses
export type UserAuthResponse = TokenResponse<SafeUser>;
export type CustomerAuthResponse = TokenResponse<SafeCustomer>;
```

---

## 🚀 Migration Strategy

### Step 1: Keep Current Schema

Don't change anything yet - your current schema is valid!

### Step 2: Add RBAC Gradually

```typescript
// Start simple
enum UserRole {
  ADMIN
  STAFF
}

// Later expand
enum UserRole {
  SUPER_ADMIN
  ADMIN
  MANAGER
  STAFF
}
```

### Step 3: Add Permissions Later

Only add `Permission` model if you need fine-grained control.

---

## 📊 Comparison

| Feature  | User (Admin)       | Customer (Buyer)  |
| -------- | ------------------ | ----------------- |
| Purpose  | Manage dashboard   | Buy products      |
| Password | Required           | Optional (guests) |
| Roles    | ADMIN, STAFF, etc. | None (all same)   |
| Access   | Admin panel        | Store frontend    |
| Example  | staff@company.com  | john@gmail.com    |

---

## ✅ Recommendation

**Keep your current schema!** It's already correct:

1. ✅ **User** model is for admin staff (with roles)
2. ✅ **Customer** model is for buyers (with optional password)
3. ✅ They're separate - this is GOOD design

**Only add**:

- More roles to `UserRole` enum (MANAGER, STAFF, etc.)
- Optional `permissions` field to User if you need fine-grained RBAC

---

## 🎯 Final Schema (Recommended)

Just update your existing `UserRole` enum:

```prisma
enum UserRole {
  SUPER_ADMIN  // Add this
  ADMIN
  MANAGER      // Add this
  STAFF        // Add this (rename from USER)
}
```

Everything else stays the same! ✨
