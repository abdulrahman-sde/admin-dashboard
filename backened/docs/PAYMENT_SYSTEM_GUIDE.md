# 💳 Payment System Architecture & Stripe Integration Guide

This document explains the production-ready order and payment system implemented in this project, and guides you through replacing the mock gateway with actual Stripe integration.

---

## 🏗️ Architecture Overview

The system follows a strict **4-layer architecture** to ensure separation of concerns, type safety, and atomic data integrity.

### 1. **Utility Layer** (`src/utils/`)

- **`pricing.utils.ts`**: Centralized logic for calculating subtotals, taxes, shipping, and discounts (server-side only, never trusting client math).
- **`order.utils.ts`**: Generates professional, unique IDs (e.g., `ORD-K9X2-M93`, `TXN-92A-L10`).

### 2. **Gateway Layer** (`src/services/payment/`)

- **`payment-gateway.interface.ts`**: Defines the contract (`IPaymentGateway`) that ANY provider must satisfy. This makes swapping providers (Stripe → PayPal) trivial.
- **`mock-payment-gateway.ts`**: A robust simulation of Stripe. It handles:
  - ✅ **Success**: Normal transactions.
  - ❌ **Failure**: Order amounts equal to **666** automatically fail (simulating "Insufficent Funds").
  - 🔐 **3D Secure**: Order amounts ending in **999** require extra action (simulating "SCA").
  - 🔄 **Async Webhooks**: Simulates the delay between "Checkout" and "Payment Confirmed".

### 3. **Service Layer** (`src/services/orders/`)

- **`orders.service.ts`**:
  - Validates stock & pricing.
  - Creates a `PaymentIntent` via the Gateway **before** touching the DB.
  - Performs an **Atomic Transaction**: Creates Order + Items + Transaction + Decrements Stock all at once.
  - Leaves Order/Transaction in `PENDING` state until the webhook fires.

### 4. **Webhook Layer** (`src/services/payment/webhook.service.ts`)

- The "Brain" of the payment system. It listens for events and handles the business logic:
- **On `payment.succeeded`**:
  - Marks Order & Transaction as `COMPLETED`.
  - Updates Customer Analytics (Total Spent, Last Order).
- **On `payment.failed`**:
  - **CRITICAL**: Automatically **restores stock** for all items.
  - Marks Order as `CANCELED` and Transaction as `FAILED`.

---

## 🧪 How to Test (Mock System)

### 1. Create an Order

POST to your create order endpoint. The order will be created as `PENDING`.

### 2. Simulate Webhook Events

Use the built-in test controller (`src/controllers/admin/payment-test.controller.ts`) to force outcomes.

**Endpoint:** `POST /api/webhooks/test-trigger` (Register this route in your admin router)

**Body:**

```json
{
  "paymentIntentId": "pi_mock_...",
  "status": "success" // or "failed"
}
```

---

## 🚀 Validating Production Readiness for Stripe

To move from Mock to Real Stripe, follow these exact steps. **You do NOT need to change your controller or service logic**, only the gateway implementation.

### Step 1: Install Stripe SDK

```bash
npm install stripe
```

### Step 2: Env Variables

Add these to your `.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 3: Create `StripePaymentGateway`

Create `src/services/payment/stripe-payment-gateway.ts`:

```typescript
import Stripe from "stripe";
import { IPaymentGateway, PaymentIntent } from "./payment-gateway.interface";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export class StripePaymentGateway implements IPaymentGateway {
  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    paymentMethod: string;
    customerId: string;
    orderId: string;
    metadata?: Record<string, any>;
  }): Promise<PaymentIntent> {
    // Stripe expects amounts in cents (USD)
    const amountInCents = Math.round(params.amount * 100);

    const intent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: params.currency,
      metadata: {
        orderId: params.orderId,
        customerId: params.customerId,
        ...params.metadata,
      },
      automatic_payment_methods: { enabled: true },
    });

    return {
      id: intent.id,
      amount: intent.amount / 100, // Convert back to main unit
      currency: intent.currency,
      status: intent.status === "succeeded" ? "succeeded" : "pending",
      clientSecret: intent.client_secret || undefined,
    };
  }

  // Implement other methods (confirm, refund, cancel) using Stripe SDK...
}

export const paymentGateway = new StripePaymentGateway(); // Export this instead of Mock
```

### Step 4: Swap the Import in `orders.service.ts`

Go to `src/services/orders/orders.service.ts`:

```typescript
// DELETE:
// import { paymentGateway } from "../payment/mock-payment-gateway.js";

// ADD:
import { paymentGateway } from "../payment/stripe-payment-gateway.js";
```

### Step 5: Update Webhook Controller (+ Signature Verification)

Real Stripe webhooks **must** be verified to prevent fake requests.

Update `src/controllers/storefront/webhooks.controller.ts`:

```typescript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const handlePaymentWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    // Use rawBody (ensure your express app parses raw body for this route!)
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Parse Stripe Event to our generic WebhookEvent format
  const genericEvent: WebhookEvent = {
    type: event.type as any,
    paymentIntentId: (event.data.object as any).id,
    // ... map other fields
  };

  await webhookQueue.push(genericEvent); // The rest remains the same!
  res.json({ received: true });
};
```

---

That's it! Your system is now **100% decoupling compliant**. You changed the engine (Gateway) without breaking the car (Service/Repositories).
