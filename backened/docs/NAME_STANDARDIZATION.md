# How to Standardize: User to firstName/lastName

## Option 1: Change User Schema (Recommended for Consistency)

### Step 1: Update Prisma Schema

```prisma
// prisma/schema.prisma
model User {
  id       String     @id @default(auto()) @map("_id") @db.ObjectId
  email    String     @unique

  // ✅ CHANGE THIS
  firstName String    // New: was "name"
  lastName  String    // New: add this

  password String
  role     UserRole   @default(USER)
  status   UserStatus @default(ACTIVE)

  avatar String?
  phone  String?

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
  lastLoginAt DateTime?

  @@map("users")
}
```

### Step 2: Create Migration

```bash
npx prisma migrate dev --name change_user_name_to_firstname_lastname
```

**Warning**: This will break existing data! You need a data migration script.

### Step 3: Update Validators

```typescript
// validators/auth.validator.ts
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"), // ✅ Changed
  lastName: z.string().min(2, "Last name must be at least 2 characters"), // ✅ Added
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "USER"]).optional(),
});

// validators/users.validator.ts
export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2), // ✅ Changed
  lastName: z.string().min(2), // ✅ Added
  password: z.string().min(6),
  role: z.enum(["ADMIN", "USER"]).optional(),
});
```

### Step 4: Update Types

```typescript
// types/auth.types.ts
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string; // ✅ Changed
    lastName: string; // ✅ Added
    role: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string; // ✅ Changed
  lastName: string; // ✅ Added
}
```

### Step 5: Update Controllers

Anywhere you use `user.name`, change to:

```typescript
// Before
const fullName = user.name;

// After
const fullName = `${user.firstName} ${user.lastName}`;
```

---

## Option 2: Change Customer to Single Name (NOT Recommended)

**Don't do this** - firstName/lastName is better for customers.

---

## Option 3: Keep It As-Is (Also Valid)

**Reasoning**: They serve different purposes

- **Admin users**: Internal staff, single name is fine
- **Customers**: External buyers, need proper name handling

This is actually a common pattern in many systems!

---

## My Suggestion 🎯

**Keep it as-is for now** because:

1. ✅ Both work fine
2. ✅ Customers definitely need firstName/lastName (industry standard)
3. ✅ Admin `name` is simpler for internal users
4. ✅ No data migration needed

**Later**, if you want perfect consistency, change User to firstName/lastName, but it's **not urgent**.

---

## Quick Fix: Helper Function

If you want to display names consistently:

```typescript
// utils/formatters.ts
export const getFullName = (user: User | Customer): string => {
  // Check if it's a Customer (has firstName)
  if ("firstName" in user) {
    return `${user.firstName} ${user.lastName}`;
  }
  // It's a User (has name)
  return user.name;
};
```

**Usage**:

```typescript
const fullName = getFullName(user); // Works for both User and Customer!
```
