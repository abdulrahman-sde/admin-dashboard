# Beginner's Guide to Auth Types & Response Utilities

## 📚 Table of Contents

1. [What are Types?](#what-are-types)
2. [auth.types.ts Explained](#authtypests-explained)
3. [response.ts Explained](#responsets-explained)
4. [Real-World Examples](#real-world-examples)

---

## What are Types?

Think of **types** as blueprints or contracts that tell TypeScript (and you!) what shape your data should have.

### Analogy

Imagine you're ordering a pizza:

- **Without types**: "Give me a pizza" (unclear - what size? toppings?)
- **With types**: "Give me a large pizza with pepperoni and cheese" (clear and specific)

Types help catch mistakes **before** your code runs!

---

## auth.types.ts Explained

This file defines the "shape" of authentication-related data.

### 1. **AuthRequest**

```typescript
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
```

**What it is**: A special version of Express's `Request` object that also includes user information.

**When to use**: After a user logs in and you want to access their info in controllers.

**Example**:

```typescript
// In a protected route controller
export const getProfile = async (req: AuthRequest, res: Response) => {
  // TypeScript knows req.user exists and has these properties!
  console.log(req.user?.id); // ✅ TypeScript is happy
  console.log(req.user?.email); // ✅ TypeScript is happy
  // console.log(req.user?.age); // ❌ Error: 'age' doesn't exist
};
```

---

### 2. **CustomerAuthRequest**

```typescript
export interface CustomerAuthRequest extends Request {
  customer?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}
```

**What it is**: Similar to `AuthRequest`, but for store customers (not admin users).

**When to use**: In customer-facing endpoints (e.g., customer profile, orders).

**Example**:

```typescript
// Customer placing an order
export const createOrder = async (req: CustomerAuthRequest, res: Response) => {
  const customerId = req.customer?.id; // Get logged-in customer's ID
  // Create order for this customer
};
```

---

### 3. **ApiResponse<T>**

```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
```

**What it is**: A standardized format for all API responses.

**Components**:

- `success`: `true` if operation worked, `false` if error
- `message`: Optional description ("Login successful")
- `data`: The actual data (user info, list of products, etc.)
- `error`: Error message if something went wrong

**When to use**: To ensure all your API responses have the same structure.

**Example**:

```typescript
// Success response
const response: ApiResponse<User> = {
  success: true,
  message: "User fetched successfully",
  data: { id: "123", email: "john@example.com", name: "John" },
};

// Error response
const errorRes: ApiResponse = {
  success: false,
  error: "User not found",
};
```

---

### 4. **LoginRequest**

```typescript
export interface LoginRequest {
  email: string;
  password: string;
}
```

**What it is**: Defines what data you need to log in.

**When to use**: In your login controller to type-check the incoming request body.

**Example**:

```typescript
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginRequest;
  // Now TypeScript knows email and password should be strings
};
```

---

### 5. **RegisterRequest**

```typescript
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}
```

**What it is**: Defines what data you need to register a new user.

**When to use**: In your register controller.

**Example**:

```typescript
export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body as RegisterRequest;
  // Create user with these fields
};
```

---

### 6. **AuthResponse**

```typescript
export interface AuthResponse {
  user: Omit<User, "password">; // User data WITHOUT password
  accessToken: string;
  refreshToken: string;
}
```

**What it is**: Defines what data you send back after successful login/register.

**Components**:

- `user`: User information (but password is excluded for security!)
- `accessToken`: Short-lived token (15 minutes)
- `refreshToken`: Long-lived token (7 days)

**When to use**: When sending response after login/register.

**Example**:

```typescript
export const login = async (req: Request, res: Response) => {
  // ... validate credentials ...

  const response: AuthResponse = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      // ❌ NO password field!
    },
    accessToken: "jwt_token_here",
    refreshToken: "refresh_token_here",
  };

  res.json(response);
};
```

---

## response.ts Explained

This file contains **helper functions** to create consistent API responses.

### 1. **successResponse()**

```typescript
export const successResponse = (data: any, message = "Success") => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});
```

**What it does**: Creates a standardized success response.

**Parameters**:

- `data`: The data you want to send back
- `message`: Optional message (default: "Success")

**Returns**:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": { "id": "123", "name": "John" },
  "timestamp": "2024-12-11T13:00:00.000Z"
}
```

**When to use**: Every time you want to send success data.

**Example**:

```typescript
import { successResponse } from "../utils/response.js";

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  // Without helper (repetitive)
  // res.json({
  //   success: true,
  //   message: "Users fetched",
  //   data: users,
  //   timestamp: new Date().toISOString()
  // });

  // With helper (clean!)
  res.json(successResponse(users, "Users fetched successfully"));
};
```

---

### 2. **errorResponse()**

```typescript
export const errorResponse = (message: string, statusCode = 500) => ({
  success: false,
  message,
  statusCode,
  timestamp: new Date().toISOString(),
});
```

**What it does**: Creates a standardized error response.

**Parameters**:

- `message`: Error message to display
- `statusCode`: HTTP status code (default: 500)

**Returns**:

```json
{
  "success": false,
  "message": "User not found",
  "statusCode": 404,
  "timestamp": "2024-12-11T13:00:00.000Z"
}
```

**When to use**: When something goes wrong.

**Example**:

```typescript
import { errorResponse } from "../utils/response.js";

export const getUserById = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });

  if (!user) {
    return res.status(404).json(errorResponse("User not found", 404));
  }

  res.json(successResponse(user));
};
```

---

### 3. **paginatedResponse()**

```typescript
export const paginatedResponse = (
  data: any[],
  page: number,
  limit: number,
  total: number
) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  },
  timestamp: new Date().toISOString(),
});
```

**What it does**: Creates a response with pagination info (for long lists).

**Parameters**:

- `data`: Array of items for current page
- `page`: Current page number (1, 2, 3...)
- `limit`: Items per page (10, 20, 50...)
- `total`: Total number of items in database

**Returns**:

```json
{
  "success": true,
  "data": [
    /* 10 users */
  ],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": true
  },
  "timestamp": "2024-12-11T13:00:00.000Z"
}
```

**When to use**: When returning lists that could be long (users, products, orders).

**Example**:

```typescript
import { paginatedResponse } from "../utils/response.js";

export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Get products for this page
  const products = await prisma.product.findMany({
    skip,
    take: limit,
  });

  // Get total count
  const total = await prisma.product.count();

  res.json(paginatedResponse(products, page, limit, total));
};
```

**Frontend can use this**:

```javascript
// Frontend code
const response = await fetch("/api/products?page=2&limit=10");
const data = await response.json();

console.log(data.pagination.totalPages); // 5
console.log(data.pagination.hasNextPage); // true
// Show "Next" button if hasNextPage is true
```

---

## Real-World Examples

### Complete Login Flow

```typescript
// controllers/auth.controller.ts
import type { Request, Response } from "express";
import { loginSchema } from "../validators/auth.validator.js";
import { prisma } from "../lib/prisma.js";
import { comparePassword } from "../lib/hash.js";
import { generateTokens } from "../lib/jwt.js";
import { successResponse } from "../utils/response.js";
import { UnauthorizedError } from "../utils/errors.js";
import type { LoginRequest, AuthResponse } from "../types/auth.types.js";

export const login = async (req: Request, res: Response): Promise<void> => {
  // 1. Validate input
  const { email, password } = loginSchema.parse(req.body) as LoginRequest;

  // 2. Find user
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // 3. Check password
  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // 4. Generate tokens
  const tokens = generateTokens({ userId: user.id, role: user.role });

  // 5. Create response (using AuthResponse type)
  const authResponse: AuthResponse = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      lastLoginAt: user.lastLoginAt,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };

  // 6. Send response (using successResponse helper)
  res.json(successResponse(authResponse, "Login successful"));
};
```

**Response to client**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "123",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-12-11T13:00:00.000Z"
}
```

---

### Complete Protected Route Example

```typescript
// controllers/users.controller.ts
import type { Response } from "express";
import { successResponse, paginatedResponse } from "../utils/response.js";
import { prisma } from "../lib/prisma.js";
import type { AuthRequest } from "../types/auth.types.js";

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  // req.user is available because of AuthRequest type!
  const userId = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      phone: true,
    },
  });

  res.json(successResponse(user, "Profile fetched successfully"));
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    }),
    prisma.user.count(),
  ]);

  // Using paginatedResponse helper
  res.json(paginatedResponse(users, page, limit, total));
};
```

---

## Summary

### auth.types.ts

**Purpose**: Define the "shape" of authentication data

| Type                  | Use Case                     |
| --------------------- | ---------------------------- |
| `AuthRequest`         | Protected admin routes       |
| `CustomerAuthRequest` | Protected customer routes    |
| `ApiResponse<T>`      | Type-safe API responses      |
| `LoginRequest`        | Login data validation        |
| `RegisterRequest`     | Registration data validation |
| `AuthResponse`        | Login/register response      |

### response.ts

**Purpose**: Create consistent API responses easily

| Function              | Use Case                 | Example                                                     |
| --------------------- | ------------------------ | ----------------------------------------------------------- |
| `successResponse()`   | Any successful operation | `res.json(successResponse(user))`                           |
| `errorResponse()`     | Error handling           | `res.status(404).json(errorResponse("Not found", 404))`     |
| `paginatedResponse()` | Lists with pagination    | `res.json(paginatedResponse(products, page, limit, total))` |

---

## Benefits

✅ **Consistency**: All responses look the same  
✅ **Type Safety**: Catch errors before runtime  
✅ **Less Code**: Reusable helpers  
✅ **Better DX**: TypeScript autocomplete works perfectly  
✅ **Maintainability**: Change response format in one place

---

## Quick Reference

```typescript
// Import types
import type {
  AuthRequest,
  LoginRequest,
  AuthResponse,
} from "../types/auth.types.js";

// Import helpers
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/response.js";

// Use in controller
export const myController = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id; // ✅ Type-safe

  // Success
  res.json(successResponse(data, "Success message"));

  // Error
  res.status(404).json(errorResponse("Not found", 404));

  // Paginated
  res.json(paginatedResponse(items, page, limit, total));
};
```
