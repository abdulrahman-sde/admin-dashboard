# Dashboard Backend - Restructured

## 📁 New Folder Structure

```
src/
├── controllers/          # HTTP handlers (organized by feature)
│   ├── auth.controller.ts
│   ├── users.controller.ts
│   ├── customers.controller.ts
│   └── ... (add more as needed)
│
├── routes/              # Route definitions
│   ├── auth.route.ts
│   ├── users.route.ts
│   ├── customers.route.ts
│   └── index.ts         # Main router
│
├── validators/          # Zod validation schemas
│   ├── auth.validator.ts
│   ├── users.validator.ts
│   ├── customers.validator.ts
│   └── common.validator.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
│
├── lib/                 # Utilities
│   ├── prisma.ts
│   ├── hash.ts          # Password hashing
│   ├── jwt.ts           # Token generation/verification
│   └── utils/
│       ├── asyncHandler.ts
│       └── errors.ts
│
├── types/               # TypeScript types
│   ├── express.d.ts
│   └── auth.types.ts
│
├── utils/               # Helper functions
│   └── response.ts      # Standard API responses
│
└── server.ts
```

## 🔄 What Changed

### Before (Admin/Customer Split)

```
controllers/admin/auth.controller.ts    ❌
controllers/customer/auth.controller.ts ❌
routes/admin/auth.route.ts             ❌
routes/customer/auth.route.ts          ❌
```

### After (Feature-Based)

```
controllers/auth.controller.ts         ✅
routes/auth.route.ts                   ✅
validators/auth.validator.ts           ✅
```

## 📝 Implementation Status

### ✅ Completed

- ✅ Created new folder structure
- ✅ Created validators (auth, users, customers, common)
- ✅ Created empty controllers (ready for your implementation)
- ✅ Created routes pointing to new controllers
- ✅ Updated main router (`routes/index.ts`)
- ✅ Updated `server.ts` to use `/api` prefix
- ✅ Created utility helpers (`hash.ts`, `jwt.ts`, `response.ts`)

### 🔨 TODO - For You to Implement

1. **Implement Controller Logic**

   - `controllers/auth.controller.ts` - Register, login, logout, refresh token
   - `controllers/users.controller.ts` - CRUD for admin users
   - `controllers/customers.controller.ts` - CRUD for customers

2. **Create Additional Features** (as needed)

   - Products controller/routes/validators
   - Categories controller/routes/validators
   - Orders controller/routes/validators
   - Payments controller/routes/validators
   - Sessions controller/routes/validators
   - Analytics controller/routes/validators

3. **Clean Up Old Files** (after migrating logic)
   - Delete `controllers/admin/` folder
   - Delete `controllers/customer/` folder
   - Delete `routes/admin/` folder
   - Delete `routes/customer/` folder
   - Delete `lib/validators/` folder

## 🚀 API Routes

All routes are now under `/api`:

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh

GET    /api/users
GET    /api/users/:id
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id

GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PATCH  /api/customers/:id
DELETE /api/customers/:id
```

## 📦 Available Utilities

### Password Hashing

```typescript
import { hashPassword, comparePassword } from "./lib/hash.js";

const hashed = await hashPassword("mypassword");
const isValid = await comparePassword("mypassword", hashed);
```

### JWT Tokens

```typescript
import { generateTokens, verifyToken } from "./lib/jwt.js";

const tokens = generateTokens({ userId: "123", role: "ADMIN" });
const payload = verifyToken(tokens.accessToken);
```

### API Responses

```typescript
import { successResponse, paginatedResponse } from "./utils/response.js";

res.json(successResponse(user, "User created successfully"));

res.json(paginatedResponse(users, page, limit, total));
```

### Validators

```typescript
import { registerSchema } from "./validators/auth.validator.js";
import { paginationSchema } from "./validators/common.validator.js";

// Validate in controller
registerSchema.parse(req.body);
paginationSchema.parse(req.query);
```

## 🔧 Next Steps

1. Copy your existing logic from old controllers to new ones
2. Test each endpoint to ensure it works
3. Delete old folder structure
4. Add new features as needed

## 📖 Example Controller Implementation

```typescript
// controllers/auth.controller.ts
import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../lib/hash.js";
import { generateTokens } from "../lib/jwt.js";
import { successResponse } from "../utils/response.js";
import { ConflictError, UnauthorizedError } from "../lib/utils/errors.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, role } = registerSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: role || "USER",
    },
    select: { id: true, email: true, name: true, role: true },
  });

  res.status(201).json(successResponse(user, "Registration successful"));
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.password))) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const tokens = generateTokens({ userId: user.id, role: user.role });

  const { password: _, ...userWithoutPassword } = user;

  res
    .cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    })
    .json(successResponse({ user: userWithoutPassword, ...tokens }));
};
```
