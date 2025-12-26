# Coupon Logic Implementation

## Overview

I've successfully integrated coupon functionality into your order creation system. Customers can now apply discount coupons during checkout with full validation and tracking.

## What Was Implemented

### 1. **Database Schema Updates** (`prisma/schema.prisma`)

Added coupon tracking fields to the Order model:

- `couponId` - References the applied coupon
- `couponCode` - Stores the coupon code used (for historical reference)

### 2. **Validator Updates** (`src/validators/order.validator.ts`)

- Added `couponCode` field to `createOrderInputSchema` (optional string)
- Allows customers to submit a coupon code during checkout

### 3. **Coupon Application Service** (`src/services/coupons/coupon-application.service.ts`)

Created a dedicated service to handle coupon validation and discount calculation:

**Features:**

- ✅ Validates coupon exists
- ✅ Checks coupon status (must be ACTIVE)
- ✅ Validates date range (startDate and endDate)
- ✅ Verifies usage limits haven't been exceeded
- ✅ Calculates discount based on coupon type:
  - **FIXED/PRICE_DISCOUNT**: Deducts fixed amount from subtotal
  - **PERCENTAGE**: Calculates percentage of subtotal
  - **FREE_SHIPPING**: Applies shipping fee as discount
- ✅ Returns discount amount and coupon details

**Error Handling:**

- Throws `ValidationError` for invalid, expired, or exhausted coupons
- Provides clear error messages to users

### 4. **Orders Service Updates** (`src/services/orders/orders.service.ts`)

Enhanced the `createOrder` function with coupon logic:

**Order of Operations:**

1. Validate products and stock
2. Calculate initial subtotal
3. **Apply coupon if provided** (NEW)
   - Validates coupon code
   - Calculates discount amount
   - Stores coupon ID and code
4. Calculate final pricing with discount
5. Create order and transaction
6. **Increment coupon usage count** (background task)

### 5. **Coupon Validation API** (Storefront)

Created a new endpoint for validating coupons before final checkout:

**Endpoint:** `POST /api/storefront/coupons/validate`

**Request Body:**

```json
{
  "couponCode": "SUMMER2024",
  "subtotal": 100.0,
  "shippingFee": 10.0
}
```

**Response:**

```json
{
  "success": true,
  "message": "Coupon is valid",
  "data": {
    "valid": true,
    "couponCode": "SUMMER2024",
    "couponName": "Summer Sale",
    "couponType": "PERCENTAGE",
    "discountAmount": 20.0,
    "finalTotal": 90.0
  }
}
```

**Files Created:**

- `src/controllers/storefront/coupons.controller.ts`
- `src/routes/storefront/coupons.routes.ts`

### 6. **Bug Fixes**

Fixed an import error in `auth.routes.ts` that was causing server crashes.

## How It Works

### Customer Journey:

1. **During Checkout:**

   - Customer adds items to cart
   - Enters coupon code (optional)
   - Frontend can call `/api/storefront/coupons/validate` to show real-time discount

2. **Order Creation:**

   - Backend validates the coupon code
   - Calculates appropriate discount
   - Stores coupon reference with order
   - Increments coupon usage count

3. **Order Record:**
   - Order includes `couponId` and `couponCode` fields
   - Discount amount is reflected in the `discount` field
   - `totalAmount` reflects the final price after discount

## Coupon Types Supported

| Type               | Description             | Calculation                 |
| ------------------ | ----------------------- | --------------------------- |
| **FIXED**          | Fixed amount discount   | Min(coupon.value, subtotal) |
| **PERCENTAGE**     | Percentage off subtotal | (subtotal × value) / 100    |
| **FREE_SHIPPING**  | Free shipping           | shippingFee                 |
| **PRICE_DISCOUNT** | Same as FIXED           | Min(coupon.value, subtotal) |

## Example Usage

### Create Order with Coupon:

```typescript
POST /api/storefront/orders

{
  "items": [...],
  "shippingAddress": {...},
  "paymentMethod": "CREDIT_CARD",
  "shippingFee": 10.00,
  "couponCode": "WELCOME10"  // <-- Coupon code
}
```

### Response:

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "676063b1a58d1c89ba7c9d6f",
    "orderNumber": "ORD-1734336177",
    "totalAmount": 95.0 // After $10 discount
  }
}
```

## Validation Rules

The coupon validation ensures:

- ✅ Coupon code exists in database
- ✅ Status is "ACTIVE"
- ✅ Current date is after startDate
- ✅ Current date is before endDate (if set)
- ✅ Usage count is below usageLimit (if set)

## Database Updates Required

Run the following to update your database schema:

```bash
npx prisma db push
# or for production
npx prisma migrate dev --name add_coupon_to_orders
```

## Testing

### Test Coupon Validation:

```bash
curl -X POST http://localhost:4000/api/storefront/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{
    "couponCode": "TEST123",
    "subtotal": 100,
    "shippingFee": 10
  }'
```

### Test Order with Coupon:

```bash
curl -X POST http://localhost:4000/api/storefront/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "shippingAddress": {...},
    "couponCode": "TEST123",
    ...
  }'
```

## Next Steps (Optional Enhancements)

1. **Per-Customer Usage Limits**: Track coupon usage per customer
2. **Minimum Purchase Amount**: Add `minPurchaseAmount` to coupons
3. **Product-Specific Coupons**: Use `appliesTo` JSON field for targeted discounts
4. **Auto-Apply Best Coupon**: Compare multiple coupons and apply the best one
5. **Coupon Analytics**: Track which coupons drive the most sales

## Files Modified/Created

### Modified:

- ✏️ `prisma/schema.prisma` - Added coupon fields to Order model
- ✏️ `src/validators/order.validator.ts` - Added couponCode field
- ✏️ `src/services/orders/orders.service.ts` - Integrated coupon logic
- ✏️ `src/routes/storefront/index.ts` - Registered coupon routes
- ✏️ `src/routes/storefront/auth.routes.ts` - Fixed import bug

### Created:

- ✨ `src/services/coupons/coupon-application.service.ts` - Coupon validation logic
- ✨ `src/controllers/storefront/coupons.controller.ts` - Coupon API controller
- ✨ `src/routes/storefront/coupons.routes.ts` - Coupon routes

## Summary

Your e-commerce backend now has a fully functional coupon system! Customers can apply discount codes during checkout, with comprehensive validation to prevent misuse. The system automatically tracks coupon usage and stores historical data with each order.

The implementation is production-ready with proper error handling, validation, and follows your established architectural patterns. 🎉
