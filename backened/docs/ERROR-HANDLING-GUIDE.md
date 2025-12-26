# Production-Grade Error Handling in Node.js & Express

> A beginner's journey from duplicated try-catch blocks to centralized error middleware

**Author:** Abdul Rahman  
**Date:** December 9, 2025  
**Level:** Beginner to Intermediate

---

## Table of Contents

1. [The Problem: Why Error Handling Matters](#the-problem)
2. [Phase 1: The Beginner Approach (Duplicated Code)](#phase-1-beginner-approach)
3. [Phase 2: Understanding Custom Error Classes](#phase-2-custom-error-classes)
4. [Phase 3: Centralized Error Middleware](#phase-3-error-middleware)
5. [Phase 4: Async Error Handler](#phase-4-async-handler)
6. [Phase 5: Production-Ready Setup](#phase-5-production-ready)
7. [Common Pitfalls & Solutions](#common-pitfalls)
8. [Complete Code Examples](#complete-examples)

---

## The Problem: Why Error Handling Matters {#the-problem}

When I started building my first Express backend, I had **no idea** how to handle errors properly. Every tutorial showed different approaches, and I was confused about:

- ❓ Where to handle errors - in controllers or somewhere else?
- ❓ How to send proper HTTP status codes (400, 401, 404, 500)?
- ❓ How to avoid repeating `try-catch` in every function?
- ❓ What the heck is "middleware" and why do I need it?

Let me show you the journey from messy code to clean, production-grade error handling.

---

## Phase 1: The Naive Approach (Inline Error Responses) {#phase-1-beginner-approach}

### What I Initially Wrote

When I first started, I handled errors **inline** - checking conditions and immediately sending responses:

```typescript
// ❌ PHASE 1: Inline error handling (no try-catch)
export const register = async (req, res) => {
  const { email, password } = req.body;

  // Check each field and respond immediately
  if (!email) {
    res.status(400).json({ error: "Email required" });
    return;
  }

  if (!password) {
    res.status(400).json({ error: "Password required" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "Password too short" });
    return;
  }

  const user = await prisma.user.create({ data: { email, password } });
  res.status(201).json({ user });
};
```

### Problems

1. ❌ **No error handling for async operations** - What if database crashes?
2. ❌ **Unhandled promise rejections** - App might crash silently
3. ❌ **Inconsistent error format** - Each developer writes different JSON
4. ❌ **Validation mixed with business logic** - Hard to read

### The Crash

```typescript
// This WILL crash your app!
const user = await prisma.user.create({ data: { email, password } });
// ↑ If database is down, throws error
// ↓ No catch block = Unhandled Promise Rejection = 💥
```

**Lesson Learned:** We need try-catch for async operations!

---

## Phase 2: Adding Try-Catch (Still Duplicated) {#phase-2-try-catch}

### The "Fix"

Wrap everything in try-catch to prevent crashes:

```typescript
// ✅ Better: Won't crash, but still messy
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email required" });
      return;
    }

    if (!password) {
      res.status(400).json({ error: "Password required" });
      return;
    }

    const user = await prisma.user.create({ data: { email, password } });
    res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};
```

### Improvements

✅ App doesn't crash anymore  
✅ Errors are logged  
✅ Client gets a response (not timeout)

### New Problems

1. ❌ **Massive code duplication** - Same try-catch in 50+ functions
2. ❌ **Inconsistent error messages** - "Registration failed" vs "Failed to register"
3. ❌ **Can't distinguish error types** - All become 500, even validation errors
4. ❌ **Catch block always sends generic error** - Loses context about what failed

### The Pain Point

```typescript
// All these different errors become the same 500 response!
catch (error) {
  console.error(error);
  res.status(500).json({ error: "Registration failed" });
  // Was it validation? Database down? Duplicate email? Who knows! 🤷
}
```

**Lesson Learned:** We need to **distinguish between error types**!

---

## Phase 3: Throwing Errors in Try Block {#phase-3-throwing-errors}

### The Realization

Instead of returning responses inline, **throw errors** and handle them in catch:

```typescript
// 🔄 BETTER: Throw errors, catch handles responses
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Throw errors instead of sending responses
    if (!email) {
      throw new Error("Email required");
    }

    if (!password) {
      throw new Error("Password required");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("Email already registered");
    }

    const user = await prisma.user.create({ data: { email, password } });
    res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message || "Registration failed",
    });
  }
};
```

### Improvements

✅ Cleaner try block - only happy path code  
✅ All error handling in one place (catch block)  
✅ Actual error messages shown to client

### Still Have Problems

1. ❌ **All errors get same status code (400)** - Validation error = 400, but what about 401, 404, 409?
2. ❌ **Catch block repeated everywhere** - Still duplicating error handling logic
3. ❌ **Can't differentiate error types** - Is it validation? Auth? Not found?

### The Problem

```typescript
// Validation error
throw new Error("Email required");  // Should be 400

// Database error
throw new Error("Email already exists");  // Should be 409

// But catch block sends both as 400!
catch (error) {
  res.status(400).json({ error: error.message });
}
```

**Lesson Learned:** We need **custom error classes with status codes**!---

## Phase 4: Custom Error Classes (Better Error Types) {#phase-4-custom-error-classes}

### The Breakthrough

JavaScript has a built-in `Error` class. We can **extend** it to add status codes!

### Step 1: Create Custom Error Classes

```typescript
// src/utils/errors.ts

// Base error class with status code
class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Specific error types
class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message); // Always 400
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(401, message); // Always 401
  }
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message); // Always 404
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message); // Always 409
  }
}
```

### Step 2: Use in Controllers

```typescript
// 🔄 BETTER: Different error types with correct status codes
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new ValidationError("Email required"); // 400
    }

    if (password.length < 8) {
      throw new ValidationError("Password too short"); // 400
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictError("Email already registered"); // 409
    }

    const user = await prisma.user.create({ data: { email, password } });
    res.status(201).json({ user });
  } catch (error) {
    console.error(error);

    // Check if it's our custom error
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};

export const login = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials"); // 401
    }

    res.json({ user });
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};
```

### Improvements

✅ Correct HTTP status codes automatically  
✅ Can distinguish error types with `instanceof`  
✅ Cleaner try block - just throw the right error type  
✅ Catch block handles different errors appropriately

### Remaining Problems

1. ❌ **Still duplicating catch block logic** - Same `if instanceof` check everywhere
2. ❌ **50+ functions = 50+ catch blocks** - Still massive duplication
3. ❌ **Inconsistent error response format** - Each dev might format differently

### The Repetition

```typescript
// This catch block is IDENTICAL in every controller! 😫
catch (error) {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
  } else {
    res.status(500).json({ error: "Server error" });
  }
}
```

**Lesson Learned:** We need to **centralize** this error handling logic!

---

## Phase 5: Introducing Error Middleware {#phase-5-error-middleware}

### Understanding Middleware First

This was the hardest concept for me! Let me explain simply.

#### What is Middleware?

Middleware is just a **function** that Express calls in sequence:

```
Request → Middleware 1 → Middleware 2 → Controller → Response
```

Each middleware can:

- Process the request
- Call `next()` to pass to next middleware
- Send a response and stop the chain

#### The Key Insight

Express has **two types of middleware**:

```typescript
// Normal middleware (3 parameters)
app.use((req, res, next) => {
  console.log("Normal middleware");
  next();
});

// Error middleware (4 parameters) ← The magic!
app.use((err, req, res, next) => {
  //     ^^^ Extra parameter makes it an error handler!
  console.log("Error middleware");
  res.status(500).json({ error: err.message });
});
```

**Express identifies error handlers by counting parameters!** 🤯

When you call `next(error)`, Express **skips all normal middleware** and jumps to the first function with **4 parameters**!

### Step 3: Create Error Middleware

```typescript
// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

export const errorHandler = (
  err: Error, // ← 1st parameter
  req: Request, // ← 2nd parameter
  res: Response, // ← 3rd parameter
  next: NextFunction // ← 4th parameter (makes it error handler!)
): void => {
  console.error("Error:", err);

  // Check if it's our custom error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Unknown error - default to 500
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
```

### Step 4: Register in Server (MUST BE LAST!)

```typescript
// src/server.ts
import express from "express";
import { authRoutes } from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Normal middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// ✅ Error handler MUST be registered LAST!
app.use(errorHandler);

app.listen(4000);
```

**Critical:** Error handler must be **last** because Express checks middleware top-to-bottom!

### Step 5: Update Controllers (Pass to Middleware)

```typescript
// ✅ MUCH BETTER: Throw errors, let middleware handle them
export const register = async (req, res, next) => {
  //                                      ^^^^ Add next parameter!
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new ValidationError("Email required");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictError("Email already registered");
    }

    const user = await prisma.user.create({ data: { email, password } });
    res.status(201).json({ user });
  } catch (error) {
    next(error); // ← Pass error to middleware instead of handling here!
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    res.json({ user });
  } catch (error) {
    next(error); // ← Same pattern everywhere!
  }
};
```

### Visual Flow

```
┌──────────────────────────────────────────────┐
│  Controller throws ValidationError            │
│  throw new ValidationError("Email required")  │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│  Catch block catches error                    │
│  catch (error) { next(error); }              │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│  Express receives next(error)                 │
│  Skips all normal middleware                  │
│  Finds first middleware with 4 parameters     │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│  Error middleware runs                        │
│  errorHandler(err, req, res, next)           │
│  Checks if err instanceof AppError           │
│  Sends: { success: false, message: "..." }   │
└──────────────────────────────────────────────┘
```

### Improvements

✅ **One place for error handling** - All errors handled in middleware  
✅ **Consistent error format** - Every error response looks the same  
✅ **Centralized logging** - Log all errors in one place  
✅ **Easy to update** - Change error format once, affects all endpoints  
✅ **Cleaner catch blocks** - Just one line: `next(error)`

### Remaining Problem

1. ❌ **Still have try-catch in every controller** - Boilerplate code repeated

```typescript
// This try-catch pattern is still everywhere! 😕
try {
  // ... controller logic
} catch (error) {
  next(error);
}
```

**Lesson Learned:** Can we eliminate try-catch blocks entirely?

---

## Phase 6: AsyncHandler - Removing Try-Catch {#phase-6-async-handler}

### The Final Problem

Even with middleware, we still write the same try-catch everywhere:

```typescript
export const register = async (req, res, next) => {
  try {
    // ... logic here
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    // ... logic here
  } catch (error) {
    next(error);
  }
};

// Repeat 50 times... 😫
```

### Understanding Async Functions & Promises

Here's the core issue:

```typescript
// Async function returns a Promise
export const register = async (req, res) => {
  throw new Error("Oops"); // Creates rejected Promise
};

// Express doesn't catch Promise rejections automatically!
// Result: Unhandled Promise Rejection 💥
```

Express only catches **synchronous** errors. For async errors, we need try-catch OR... a wrapper!

### The Solution: AsyncHandler Wrapper

```typescript
// src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from "express";

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### How It Works (Step-by-Step)

```typescript
// 1. You write your controller without try-catch
const myController = async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  res.json({ user });
};

// 2. You wrap it with asyncHandler
const wrappedController = asyncHandler(myController);

// 3. AsyncHandler creates this under the hood:
const wrappedController = (req, res, next) => {
  Promise.resolve(
    myController(req, res, next) // Your async function
  ).catch(next); // Catches any error and passes to next()
};

// 4. Express calls the wrapped version
router.post("/register", wrappedController);
```

### Simplified Explanation

Think of it as **automatic try-catch**:

```typescript
// Without asyncHandler - manual try-catch
export const register = async (req, res, next) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// With asyncHandler - automatic try-catch
export const register = asyncHandler(async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  res.json({ user });
  // asyncHandler automatically does .catch(next) for us!
});
```

### Final Controllers - Clean & Beautiful!

```typescript
// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  ValidationError,
  UnauthorizedError,
  ConflictError,
} from "../utils/errors.js";

// ✅ PERFECT: No try-catch needed!
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ValidationError("Email required");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError("Email already registered");
  }

  const user = await prisma.user.create({ data: { email, password } });
  res.status(201).json({
    success: true,
    data: { user },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  res.json({
    success: true,
    data: { user },
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({
    success: true,
    data: { user },
  });
});
```

### Final Improvements

✅ **No try-catch blocks** - AsyncHandler handles it  
✅ **Clean, readable code** - Only business logic visible  
✅ **Consistent error handling** - All errors go through middleware  
✅ **Easy to maintain** - Less boilerplate code  
✅ **Type-safe** - TypeScript knows the types

### The Complete Journey - Side by Side

```typescript
// ❌ PHASE 1: Inline responses, no error handling
export const register = async (req, res) => {
  if (!email) {
    res.status(400).json({ error: "Email required" });
    return;
  }
  const user = await prisma.user.create({ data }); // Can crash!
  res.json({ user });
};

// 🔄 PHASE 2: Added try-catch, still handling in controller
export const register = async (req, res) => {
  try {
    if (!email) {
      res.status(400).json({ error: "Email required" });
      return;
    }
    const user = await prisma.user.create({ data });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed" }); // Duplicated everywhere
  }
};

// 🔄 PHASE 3: Throw errors, handle in catch
export const register = async (req, res) => {
  try {
    if (!email) {
      throw new Error("Email required");
    }
    const user = await prisma.user.create({ data });
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message }); // Still duplicated
  }
};

// 🔄 PHASE 4: Custom error classes with status codes
export const register = async (req, res) => {
  try {
    if (!email) {
      throw new ValidationError("Email required"); // Has statusCode
    }
    const user = await prisma.user.create({ data });
    res.json({ user });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
    // Still duplicated catch block!
  }
};

// 🔄 PHASE 5: Error middleware - centralized handling
export const register = async (req, res, next) => {
  try {
    if (!email) {
      throw new ValidationError("Email required");
    }
    const user = await prisma.user.create({ data });
    res.json({ user });
  } catch (error) {
    next(error); // Let middleware handle it!
    // Still need try-catch though...
  }
};

// ✅ PHASE 6: AsyncHandler - final solution!
export const register = asyncHandler(async (req, res) => {
  if (!email) {
    throw new ValidationError("Email required");
  }
  const user = await prisma.user.create({ data });
  res.json({ user });
  // No try-catch! AsyncHandler does it automatically!
});
```

---

## Phase 7: Production-Ready Setup {#phase-7-production-ready}

```typescript
// src/utils/errors.ts

// Base class for all custom errors
export class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message); // Call Error's constructor
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
```

**What's happening here?**

- `extends Error` - Inherit from JavaScript's built-in Error
- `public statusCode` - TypeScript shorthand: creates `this.statusCode` automatically
- `super(message)` - Call parent (Error) constructor
- `Object.setPrototypeOf` - Fix TypeScript inheritance quirk

### Understanding Express Middleware

**This was the hardest concept for me to grasp!** Let me explain it simply.

#### What is Middleware?

Think of middleware as a **conveyor belt** in a factory:

```
Request → Belt 1 → Belt 2 → Belt 3 → Response
```

Each "belt" (middleware) can:

- Process the request
- Pass it to the next belt using `next()`
- Send a response and stop the chain

#### Visual Flow

```
┌─────────────────────────────────────────────┐
│  Client sends: POST /api/auth/login         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Middleware 1: express.json()               │
│  • Parses JSON body                         │
│  • Calls next() ───────────┐                │
└─────────────────────────────┼───────────────┘
                              ↓
┌─────────────────────────────────────────────┐
│  Middleware 2: Your route handler           │
│  • Process login                            │
│  • If error: next(error) ──┐                │
│  • If success: send response                │
└────────────────────────────┼────────────────┘
                             ↓
┌─────────────────────────────────────────────┐
│  Middleware 3: Error Handler                │
│  • Catches all errors                       │
│  • Sends error response                     │
└─────────────────────────────────────────────┘
```

### The Magic: How Express Finds Error Handlers

**This blew my mind:** Express identifies error handlers by **counting parameters**!

```typescript
// ❌ Normal middleware (3 parameters)
app.use((req, res, next) => {
  // Handles normal requests
});

// ✅ Error middleware (4 parameters)
app.use((err, req, res, next) => {
  //     ^^^ Extra 'err' parameter = error handler!
  // Express calls this when errors occur
});
```

When you call `next(error)`, Express **skips all normal middleware** and jumps to the first function with 4 parameters!

### Create Error Handler Middleware

```typescript
// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

export const errorHandler = (
  err: Error, // ← 1st parameter
  req: Request, // ← 2nd parameter
  res: Response, // ← 3rd parameter
  next: NextFunction // ← 4th parameter (makes it an error handler!)
): void => {
  // Log error for debugging
  console.error("Error:", err);

  // Check if it's our custom error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Unknown error - return 500
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
```

### Register Error Handler (MUST BE LAST!)

```typescript
// src/server.ts
import express from "express";
import { authRoutes } from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Normal middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// ✅ Error handler MUST be registered LAST
app.use(errorHandler);

app.listen(4000);
```

**Why last?** Express checks middleware top-to-bottom. The error handler needs to be after all routes so it can catch their errors!

### Update Controllers (Clean!)

```typescript
// ✅ CLEAN: Just throw errors, middleware handles them
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new ValidationError("Email required");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictError("Email already registered");
    }

    const user = await prisma.user.create({ data: { email, password } });
    res.status(201).json({ user });
  } catch (error) {
    next(error); // ← Pass error to error middleware!
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    res.json({ user });
  } catch (error) {
    next(error); // ← Same pattern everywhere!
  }
};
```

**Much better!** But we still have try-catch everywhere...

---

## Phase 4: Async Error Handler (Remove Try-Catch) {#phase-4-async-handler}

### The Problem with Async Functions

```typescript
// Without try-catch
export const register = async (req, res, next) => {
  throw new Error("Oops"); // ❌ Unhandled Promise Rejection!
};
```

Async functions return Promises. If they reject, Express **doesn't catch them automatically**!

### The Solution: Async Handler Wrapper

```typescript
// src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from "express";

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### How It Works (Simplified)

```typescript
// When you write this:
asyncHandler(async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  res.json({ user });
});

// It becomes this:
(req, res, next) => {
  Promise.resolve(async () => {
    const user = await prisma.user.create({ data: req.body });
    res.json({ user });
  }).catch(next); // ← Automatically catches errors!
};
```

### Controllers Without Try-Catch!

```typescript
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ PERFECT: No try-catch needed!
export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ValidationError("Email required");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError("Email already registered");
  }

  const user = await prisma.user.create({ data: { email, password } });
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  res.json({ user });
});
```

**Beautiful!** Clean, readable, maintainable! 🎉

---

## Phase 7: Production-Ready Setup {#phase-7-production-ready}

Now that we understand the journey, let's see the complete production setup:

### Complete Error Classes (TypeScript)

```typescript
// src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true // Distinguish expected vs unexpected errors
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype); // Fix TypeScript inheritance
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Already exists") {
    super(409, message);
  }
}
```

### Production Error Middleware

```typescript
// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log errors
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // 1. Custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // 2. Zod Validation Errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // 3. Prisma Database Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        res.status(409).json({
          success: false,
          message: "Resource already exists",
        });
        return;
      case "P2025":
        res.status(404).json({
          success: false,
          message: "Resource not found",
        });
        return;
    }
  }

  // 4. JWT Errors
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Token expired",
    });
    return;
  }

  // 5. Default to 500
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
};
```

### Complete Server Setup

```typescript
// src/server.ts
import express from "express";
import dotenv from "dotenv";
import { authRoutes } from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error Handler (MUST BE LAST)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## Common Pitfalls & Solutions {#common-pitfalls}

### Pitfall 1: Error Handler Not Working

```typescript
// ❌ WRONG: Only 2 parameters
app.use((err, res) => {
  res.status(500).json({ error: err.message });
});

// ✅ CORRECT: MUST have 4 parameters
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

### Pitfall 2: Error Handler in Wrong Position

```typescript
// ❌ WRONG: Error handler before routes
app.use(errorHandler);
app.use("/api/auth", authRoutes); // Errors won't be caught!

// ✅ CORRECT: Error handler AFTER routes
app.use("/api/auth", authRoutes);
app.use(errorHandler); // Catches errors from all routes above
```

### Pitfall 3: Forgetting next() Parameter

```typescript
// ❌ WRONG: No next parameter
export const register = async (req, res) => {
  try {
    // ...
  } catch (error) {
    // Can't pass error to middleware!
  }
};

// ✅ CORRECT: Include next parameter
export const register = async (req, res, next) => {
  try {
    // ...
  } catch (error) {
    next(error); // Pass to error middleware
  }
};
```

### Pitfall 4: Using .safeParse() Instead of .parse()

```typescript
// ❌ WRONG: Doesn't throw errors
registerSchema.safeParse(req.body);

// ✅ CORRECT: Throws ZodError on validation failure
registerSchema.parse(req.body);
```

---

## Complete Code Examples {#complete-examples}

### Project Structure

```
src/
├── controllers/
│   └── auth.controller.ts
├── middlewares/
│   └── error.middleware.ts
├── routes/
│   └── auth.route.ts
├── utils/
│   ├── errors.ts
│   └── asyncHandler.ts
├── validators/
│   └── authSchema.ts
└── server.ts
```

### Full Controller Example

```typescript
// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  ValidationError,
  UnauthorizedError,
  ConflictError,
} from "../utils/errors.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError("Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
    select: { id: true, email: true, name: true },
  });

  // Generate token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user, token },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Generate token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    },
  });
});
```

### Full Validation Schema

```typescript
// src/validators/authSchema.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters"),
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .trim(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});
```

---

## Summary: The Evolution {#summary}

### What We Built (Step-by-Step)

**Phase 1:** Inline responses, no error handling → **App crashes**  
**Phase 2:** Added try-catch → **Works but duplicated 50+ times**  
**Phase 3:** Throw errors in try → **Still duplicated catch blocks**  
**Phase 4:** Custom error classes → **Better, but still duplicated**  
**Phase 5:** Error middleware → **Centralized, but still need try-catch**  
**Phase 6:** AsyncHandler → **Perfect! Clean and maintainable**

### Key Insights Learned

1. **Middleware is just functions** - Express calls them in order
2. **Error handlers have 4 parameters** - That's how Express finds them
3. **Custom error classes carry status codes** - No more hardcoding status in catch blocks
4. **next(error) jumps to error handler** - Skips all normal middleware
5. **AsyncHandler wraps Promise.catch()** - Eliminates try-catch boilerplate
6. **Error handler MUST be last** - Express checks middleware top-to-bottom

### Before vs After

```typescript
// ❌ BEFORE: 15 lines per controller
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email required" });
      return;
    }
    if (!password) {
      res.status(400).json({ error: "Password required" });
      return;
    }
    const user = await prisma.user.create({ data: { email, password } });
    res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// ✅ AFTER: 8 lines per controller
export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) throw new ValidationError("Email required");
  if (!password) throw new ValidationError("Password required");

  const user = await prisma.user.create({ data: { email, password } });
  res.status(201).json({ user });
});
```

**Reduction:** 47% less code, infinitely more maintainable! 🎉

### Best Practices

✅ **DO:**

- Use custom error classes for different HTTP status codes
- Place error handler middleware LAST in your app
- Use asyncHandler to eliminate try-catch blocks
- Log errors with proper context
- Hide error details in production

❌ **DON'T:**

- Handle errors differently in each controller
- Forget the 4th parameter in error middleware
- Place error handler before your routes
- Leak sensitive error info to clients
- Use generic error messages everywhere

---

## Conclusion

Error handling seemed overwhelming at first, but breaking it down into phases made it manageable:

1. Start with custom error classes
2. Add centralized error middleware
3. Use asyncHandler to clean up controllers
4. Add handlers for specific libraries (Zod, Prisma, JWT)

This pattern is used by professional Node.js developers worldwide. Once you understand it, you'll never go back to scattered try-catch blocks!

---

## Resources

- [Express Error Handling Docs](https://expressjs.com/en/guide/error-handling.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [My GitHub Repo](https://github.com/abdulrahman-sde/Admin-Dahboard-Backened)

---

**Questions or feedback?** Feel free to reach out or open an issue on GitHub!

**Happy coding!** 🚀
