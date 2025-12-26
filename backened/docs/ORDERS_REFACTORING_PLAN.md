# 🔍 Order System Analysis & Refactoring Plan

**Date:** 2025-12-15  
**Objective:** Transform order system to production-ready standard with proper payment gateway simulation

---

## 📊 Current State Analysis

### ✅ **What's Good:**

1. **Schema Design** (85% Production-Ready)

   - ✅ Proper separation: Order, OrderItem, Transaction
   - ✅ Idempotency key support
   - ✅ Payment and fulfillment status tracking
   - ✅ Session tracking for analytics
   - ✅ Soft delete support
   - ✅ Proper indexing

2. **Business Logic**

   - ✅ Stock validation before order creation
   - ✅ Idempotency handling
   - ✅ Guest customer support
   - ✅ Atomic transactions (order + items + stock decrement)

3. **Type Safety**
   - ✅ Using Zod-inferred types
   - ✅ Server-side price calculation (not trusting client)

---

### ❌ **Critical Issues:**

#### 1. **Schema Issues**

**Problem 1: Transaction.orderId is not unique**

```prisma
model Transaction {
  orderId String @db.ObjectId  // ❌ Should be @unique
  orders  Order[]               // ❌ Confusing: one-to-many but should be one-to-one
}
```

**Impact:** One transaction can be linked to multiple orders (wrong!)

**Problem 2: Missing PaymentMethod enum value**

```typescript
// Validator has:
"STRIPE"; // ❌ Not in Prisma schema

// Prisma has:
BANK; // ❌ Not in validator
```

**Problem 3: Missing transaction status tracking**

```prisma
model Transaction {
  paymentStatus PaymentStatus  // ✅ Good
  // ❌ Missing: failureReason, retryCount, webhookReceived, etc.
}
```

---

#### 2. **Code Architecture Issues**

**Issue 1: No utility functions for calculations**

```typescript
// ❌ Scattered calculation logic
const subtotal = serverItems.reduce((s, it) => s + it.totalPrice, 0);
const totalAmount = subtotal + shippingFee + taxAmount - discount;
```

**Issue 2: No payment gateway abstraction**

```typescript
// ❌ Direct transaction creation without gateway
const transactionData: any = {
  gatewayTransactionId: null, // ❌ No gateway integration
  gatewayResponse: null,
};
```

**Issue 3: No webhook handling**

- ❌ No way to handle async payment confirmations
- ❌ No way to handle payment failures
- ❌ No stock rollback on payment failure

**Issue 4: Poor type usage**

```typescript
const orderData: any = { ... };        // ❌ Using 'any'
const transactionData: any = { ... };  // ❌ Using 'any'
```

**Issue 5: No separation of concerns**

- Service handles: validation, calculation, customer creation, order creation
- Should be split into: PricingService, PaymentService, OrderService

---

#### 3. **Missing Production Features**

❌ No payment gateway simulation  
❌ No webhook endpoint  
❌ No payment retry logic  
❌ No fraud detection hooks  
❌ No order cancellation with refund  
❌ No partial refunds  
❌ No payment timeout handling  
❌ No 3D Secure simulation  
❌ No payment method validation  
❌ No currency handling

---

## 🎯 Production-Ready Refactoring Plan

### **Phase 1: Schema Fixes** ⚠️ (Database Migration Required)

#### 1.1 Fix Transaction Schema

```prisma
model Transaction {
  id                String @id @default(auto()) @map("_id") @db.ObjectId
  transactionNumber String @unique

  // ✅ FIX: Make orderId unique (one transaction per order)
  orderId    String   @unique @db.ObjectId  // ✅ CHANGED
  customerId String   @db.ObjectId
  customer   Customer @relation(fields: [customerId], references: [id])

  amount        Float
  currency      String @default("USD")  // ✅ NEW
  paymentStatus PaymentStatus
  paymentMethod PaymentMethod

  // Gateway Integration
  gatewayTransactionId String?
  gatewayResponse      Json?

  // ✅ NEW: Enhanced tracking
  failureReason String?
  failureCode   String?
  retryCount    Int     @default(0)

  // ✅ NEW: Webhook tracking
  webhookReceived   Boolean   @default(false)
  webhookReceivedAt DateTime?

  // ✅ NEW: 3D Secure / SCA
  requiresAction Boolean @default(false)
  actionUrl      String?

  // Timestamps
  paidAt    DateTime?
  failedAt  DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // ✅ FIX: Remove confusing orders array
  order Order @relation(fields: [orderId], references: [id])  // ✅ CHANGED

  @@index([orderId])
  @@index([customerId])
  @@index([paymentStatus])
  @@index([createdAt])
  @@map("transactions")
}

model Order {
  // ... existing fields ...

  // ✅ FIX: One-to-one relation
  transaction Transaction?  // ✅ CHANGED (remove array)

  // ✅ REMOVE: transactionId field (handled by relation)
}
```

#### 1.2 Fix PaymentMethod Enum

```prisma
enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  PAYPAL
  STRIPE            // ✅ ADD
  BANK_TRANSFER     // ✅ RENAME from BANK
  CASH_ON_DELIVERY
}
```

---

### **Phase 2: Create Utility Functions**

#### 2.1 Pricing Utilities (`src/utils/pricing.utils.ts`)

```typescript
export const calculateOrderPricing = (params: {
  items: { unitPrice: number; quantity: number }[];
  shippingFee?: number;
  taxRate?: number;
  discountAmount?: number;
  discountPercent?: number;
}) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const shipping = params.shippingFee ?? 0;

  // Calculate discount
  let discount = params.discountAmount ?? 0;
  if (params.discountPercent) {
    discount = subtotal * (params.discountPercent / 100);
  }

  // Calculate tax on (subtotal - discount)
  const taxableAmount = subtotal - discount;
  const tax = params.taxRate ? taxableAmount * (params.taxRate / 100) : 0;

  const total = subtotal + shipping + tax - discount;

  return {
    subtotal,
    shippingFee: shipping,
    taxAmount: tax,
    discount,
    totalAmount: total,
  };
};
```

#### 2.2 Order Number Generator (`src/utils/order.utils.ts`)

```typescript
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomUUID().slice(0, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const generateTransactionNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomUUID().slice(0, 8).toUpperCase();
  return `TXN-${timestamp}-${random}`;
};
```

---

### **Phase 3: Payment Gateway Simulation**

#### 3.1 Payment Gateway Interface (`src/services/payment/payment-gateway.interface.ts`)

```typescript
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "requires_action" | "succeeded" | "failed";
  clientSecret?: string;
  failureReason?: string;
  failureCode?: string;
}

export interface IPaymentGateway {
  createPaymentIntent(params: {
    amount: number;
    currency: string;
    paymentMethod: string;
    customerId: string;
    orderId: string;
    metadata?: Record<string, any>;
  }): Promise<PaymentIntent>;

  confirmPayment(paymentIntentId: string): Promise<PaymentIntent>;

  refundPayment(params: {
    paymentIntentId: string;
    amount?: number; // Partial refund
    reason?: string;
  }): Promise<{ id: string; status: string }>;

  cancelPayment(paymentIntentId: string): Promise<void>;
}
```

#### 3.2 Mock Payment Gateway (`src/services/payment/mock-payment-gateway.ts`)

```typescript
/**
 * Mock Payment Gateway - Simulates Stripe-like behavior
 * In production, replace with actual Stripe SDK
 */
export class MockPaymentGateway implements IPaymentGateway {
  private paymentIntents = new Map<string, PaymentIntent>();

  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    paymentMethod: string;
    customerId: string;
    orderId: string;
    metadata?: Record<string, any>;
  }): Promise<PaymentIntent> {
    const intentId = `pi_mock_${randomUUID()}`;

    // Simulate different scenarios based on amount
    let status: PaymentIntent["status"] = "pending";
    let failureReason: string | undefined;
    let failureCode: string | undefined;

    // Simulate failures for testing
    if (params.amount === 666) {
      status = "failed";
      failureReason = "Insufficient funds";
      failureCode = "card_declined";
    } else if (params.amount % 1000 === 999) {
      status = "requires_action";
    }

    const intent: PaymentIntent = {
      id: intentId,
      amount: params.amount,
      currency: params.currency,
      status,
      clientSecret: `${intentId}_secret_${randomUUID()}`,
      failureReason,
      failureCode,
    };

    this.paymentIntents.set(intentId, intent);

    // Simulate async webhook (in real Stripe, this happens via HTTP)
    if (status === "pending") {
      setTimeout(() => {
        this.simulateWebhook(intentId, "succeeded");
      }, 2000); // 2 second delay
    }

    return intent;
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentIntent> {
    const intent = this.paymentIntents.get(paymentIntentId);
    if (!intent) throw new Error("Payment intent not found");

    if (intent.status === "requires_action") {
      // Simulate 3D Secure confirmation
      intent.status = "succeeded";
      this.simulateWebhook(paymentIntentId, "succeeded");
    }

    return intent;
  }

  async refundPayment(params: {
    paymentIntentId: string;
    amount?: number;
    reason?: string;
  }): Promise<{ id: string; status: string }> {
    const intent = this.paymentIntents.get(params.paymentIntentId);
    if (!intent) throw new Error("Payment intent not found");

    const refundId = `re_mock_${randomUUID()}`;

    // Simulate webhook
    setTimeout(() => {
      this.simulateWebhook(params.paymentIntentId, "refunded");
    }, 1000);

    return { id: refundId, status: "succeeded" };
  }

  async cancelPayment(paymentIntentId: string): Promise<void> {
    const intent = this.paymentIntents.get(paymentIntentId);
    if (!intent) throw new Error("Payment intent not found");

    intent.status = "failed";
    intent.failureReason = "Canceled by user";
  }

  private simulateWebhook(intentId: string, status: string) {
    // In production, this would be an actual HTTP webhook
    // For now, we'll call our webhook handler directly
    console.log(`[MOCK GATEWAY] Webhook: ${intentId} -> ${status}`);

    // Trigger webhook handler (we'll implement this next)
    webhookQueue.push({ intentId, status });
  }
}

// Singleton instance
export const paymentGateway = new MockPaymentGateway();
```

---

### **Phase 4: Webhook Handler**

#### 4.1 Webhook Types (`src/types/webhook.types.ts`)

```typescript
export type WebhookEvent = {
  type: "payment.succeeded" | "payment.failed" | "payment.refunded";
  paymentIntentId: string;
  orderId?: string;
  amount?: number;
  failureReason?: string;
  failureCode?: string;
  timestamp: Date;
};

export type WebhookHandlerResult = {
  success: boolean;
  message: string;
  orderId?: string;
};
```

#### 4.2 Webhook Service (`src/services/payment/webhook.service.ts`)

```typescript
export class WebhookService {
  async handlePaymentSucceeded(params: {
    paymentIntentId: string;
    orderId: string;
  }): Promise<WebhookHandlerResult> {
    // 1. Find transaction
    const transaction = await prisma.transaction.findFirst({
      where: { gatewayTransactionId: params.paymentIntentId },
      include: { order: true },
    });

    if (!transaction) {
      return { success: false, message: "Transaction not found" };
    }

    // 2. Update transaction and order status
    await prisma.$transaction(async (tx) => {
      // Update transaction
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          paymentStatus: "COMPLETED",
          webhookReceived: true,
          webhookReceivedAt: new Date(),
          paidAt: new Date(),
        },
      });

      // Update order
      await tx.order.update({
        where: { id: transaction.orderId },
        data: {
          paymentStatus: "COMPLETED",
          fulfillmentStatus: "PROCESSING",
          paidAt: new Date(),
        },
      });

      // Update customer analytics
      await tx.customer.update({
        where: { id: transaction.customerId },
        data: {
          totalOrders: { increment: 1 },
          totalSpent: { increment: transaction.amount },
          lastOrderDate: new Date(),
        },
      });
    });

    return {
      success: true,
      message: "Payment confirmed",
      orderId: transaction.orderId,
    };
  }

  async handlePaymentFailed(params: {
    paymentIntentId: string;
    failureReason?: string;
    failureCode?: string;
  }): Promise<WebhookHandlerResult> {
    const transaction = await prisma.transaction.findFirst({
      where: { gatewayTransactionId: params.paymentIntentId },
      include: { order: { include: { items: true } } },
    });

    if (!transaction) {
      return { success: false, message: "Transaction not found" };
    }

    // Rollback: Restore stock, mark order as failed
    await prisma.$transaction(async (tx) => {
      // 1. Restore stock
      for (const item of transaction.order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });
      }

      // 2. Update transaction
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          paymentStatus: "FAILED",
          failureReason: params.failureReason,
          failureCode: params.failureCode,
          webhookReceived: true,
          webhookReceivedAt: new Date(),
          failedAt: new Date(),
        },
      });

      // 3. Update order
      await tx.order.update({
        where: { id: transaction.orderId },
        data: {
          paymentStatus: "FAILED",
          fulfillmentStatus: "CANCELED",
          canceledAt: new Date(),
        },
      });
    });

    return {
      success: true,
      message: "Payment failure handled, stock restored",
      orderId: transaction.orderId,
    };
  }
}

export const webhookService = new WebhookService();
```

---

### **Phase 5: Refactored Order Service**

#### 5.1 New Order Service Structure

```typescript
export class OrderService {
  async createOrder(input: CreateOrderInput): Promise<OrderCreationResult> {
    // 1. Idempotency check
    // 2. Validate products & stock
    // 3. Calculate pricing
    // 4. Create/get customer
    // 5. Create payment intent
    // 6. Create order + transaction (atomic)
    // 7. Return result
  }

  async confirmPayment(orderId: string): Promise<void> {
    // Manual confirmation (for testing)
  }

  async cancelOrder(orderId: string, reason: string): Promise<void> {
    // Cancel order and refund if paid
  }
}
```

---

## 📋 Implementation Checklist

### **Must Do (Critical):**

- [ ] Fix Transaction schema (one-to-one with Order)
- [ ] Add PaymentMethod enum value (STRIPE)
- [ ] Create pricing utility functions
- [ ] Create payment gateway interface
- [ ] Implement mock payment gateway
- [ ] Create webhook service
- [ ] Refactor order service to use utilities
- [ ] Add webhook endpoint
- [ ] Add manual payment confirmation endpoint (for testing)

### **Should Do (Important):**

- [ ] Add currency field to Transaction
- [ ] Add failure tracking fields
- [ ] Add webhook tracking fields
- [ ] Implement stock rollback on payment failure
- [ ] Add order cancellation with refund
- [ ] Add retry logic for failed payments

### **Nice to Have:**

- [ ] Partial refund support
- [ ] 3D Secure simulation
- [ ] Fraud detection hooks
- [ ] Payment timeout handling
- [ ] Multiple payment methods per order

---

## 🚀 Migration Strategy

1. **Create new migration:**

   ```bash
   npx prisma migrate dev --name fix-transaction-order-relation
   ```

2. **Update existing code** (no breaking changes for existing orders)

3. **Add new endpoints:**

   - `POST /api/webhooks/payment` - Webhook handler
   - `POST /api/admin/orders/:id/confirm-payment` - Manual confirmation
   - `POST /api/admin/orders/:id/cancel` - Cancel with refund

4. **Test scenarios:**
   - ✅ Successful payment
   - ✅ Failed payment (stock rollback)
   - ✅ Payment timeout
   - ✅ Partial refund
   - ✅ Full refund

---

## 🎯 Expected Outcome

**Before:**

- ❌ Direct transaction creation
- ❌ No payment gateway
- ❌ No webhook handling
- ❌ No stock rollback on failure
- ❌ Poor type safety (`any` types)

**After:**

- ✅ Payment gateway abstraction
- ✅ Webhook-based payment confirmation
- ✅ Automatic stock rollback on failure
- ✅ Proper utility functions
- ✅ Full type safety
- ✅ Production-ready architecture
- ✅ Easy to swap mock gateway with real Stripe

---

**Ready to implement?** Let me know and I'll start with Phase 1! 🚀
