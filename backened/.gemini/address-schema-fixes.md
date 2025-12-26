# Fixed: Order Creation & Address Schema Issues

## 🔧 **Issues Fixed:**

### 1. **Address Schema Mismatch**

The address validation schemas didn't match the Prisma `CustomerAddress` type, causing validation errors during order creation and customer management.

### 2. **Missing Address Fields**

Several fields were missing or incorrectly placed in the validators.

---

## ✅ **Solutions Applied:**

### **1. Order Validator** (`/src/utils/validators/order.validator.ts`)

**Before:**

```typescript
export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"), // ❌ Required
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  isDefault: z.boolean().optional(),
  type: z.string().optional(), // ❌ Not in Prisma schema
});
```

**After:**

```typescript
export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  address2: z.string().optional(), // ✅ Added
  city: z.string().min(1, "City is required"),
  state: z.string().optional(), // ✅ Made optional
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z.string().optional(), // ✅ Added
  apartment: z.string().optional(), // ✅ Added
  isDefault: z.boolean().optional(),
  // ✅ Removed 'type' field
});
```

### **2. Customer Validator** (`/src/utils/validators/customer.validator.ts`)

**Before:**

```typescript
const addressSchema = z.object({
  street: z.string().min(1, "Street Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal Code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  // ❌ Missing: apartment, isDefault
});

export const createCustomerSchema = z.object({
  // ... other fields
  phone: z.string().optional(),
  apartment: z.string().optional(), // ❌ Wrong location
  notes: z.string().optional(),
  address: addressSchema.optional(),
});
```

**After:**

```typescript
const addressSchema = z.object({
  street: z.string().min(1, "Street Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal Code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  apartment: z.string().optional(), // ✅ Moved to address
  isDefault: z.boolean().optional(), // ✅ Added
});

export const createCustomerSchema = z.object({
  // ... other fields
  phone: z.string().optional(),
  notes: z.string().optional(),
  address: addressSchema.optional(),
  // ✅ Removed duplicate apartment field
});
```

---

## 📋 **Prisma CustomerAddress Type** (Reference)

```prisma
type CustomerAddress {
  street     String
  address2   String?
  city       String
  state      String?
  country    String
  postalCode String
  phone      String?
  apartment  String?
  isDefault  Boolean?
}
```

---

## 🎯 **Fields Alignment:**

| Field        | Prisma Type         | Order Validator | Customer Validator | Status |
| ------------ | ------------------- | --------------- | ------------------ | ------ |
| `street`     | `String` (required) | ✅ Required     | ✅ Required        | ✅     |
| `address2`   | `String?`           | ✅ Optional     | ✅ Optional        | ✅     |
| `city`       | `String` (required) | ✅ Required     | ✅ Required        | ✅     |
| `state`      | `String?`           | ✅ Optional     | ✅ Optional        | ✅     |
| `country`    | `String` (required) | ✅ Required     | ✅ Required        | ✅     |
| `postalCode` | `String` (required) | ✅ Required     | ✅ Required        | ✅     |
| `phone`      | `String?`           | ✅ Optional     | ✅ Optional        | ✅     |
| `apartment`  | `String?`           | ✅ Optional     | ✅ Optional        | ✅     |
| `isDefault`  | `Boolean?`          | ✅ Optional     | ✅ Optional        | ✅     |

---

## ✨ **Benefits:**

1. ✅ **Order creation** will now accept all valid address fields
2. ✅ **Customer creation** has consistent address validation
3. ✅ **No more validation errors** for missing or extra fields
4. ✅ **State field is optional** (works for countries without states)
5. ✅ **Apartment field** properly nested in address object
6. ✅ **100% alignment** between Prisma schema and validators

---

## 🚀 **What's Now Working:**

### **Order Creation:**

```typescript
// ✅ This will now work
POST /orders
{
  "shippingAddress": {
    "street": "123 Main St",
    "address2": "Apt 4B",        // ✅ Works now
    "city": "New York",
    "state": "NY",                // ✅ Optional
    "country": "USA",
    "postalCode": "10001",
    "phone": "+1234567890",       // ✅ Works now
    "apartment": "4B"             // ✅ Works now
  }
}
```

### **Customer Creation:**

```typescript
// ✅ This will now work
POST /customers
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "address": {
    "street": "456 Oak Ave",
    "apartment": "2A",            // ✅ Properly nested
    "city": "Los Angeles",
    "country": "USA",
    "postalCode": "90001"
  }
}
```

---

## 📝 **No Database Migration Needed**

Since you're using MongoDB (schemaless), no migration is required. The Prisma schema already had the correct fields defined in the `CustomerAddress` type.

Your order creation and customer management should now work without validation errors! 🎉
