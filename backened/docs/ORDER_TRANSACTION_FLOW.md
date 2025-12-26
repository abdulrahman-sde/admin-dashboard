# 🛒 Order & Transaction Flow Documentation

This document outlines the architecture, data flow, and database schema for the Order Processing System.

---

## 🔄 Order Creation Flow (Synchronous)

The current implementation uses a **synchronous** flow for order creation. This means the Order, OrderItems, and Transaction records are created in a single atomic database operation.

### **Step-by-Step Process**

1.  **Incoming Request**: Client sends a `POST /api/storefront/orders` request with items, customer info, and shipping details.
2.  **Validation (Service Layer)**:
    - **Idempotency Check**: Checks `idempotencyKey` to prevent duplicate orders.
    - **Stock Validation**:Verifies that requested products exist and have sufficient `stockQuantity`.
    - **Price Calculation**: Server recalculates totals (Subtotal, Tax, Shipping, Discount) ensuring client cannot manipulate prices.
3.  **Data Preparation**:
    - Generates unique `OrderNumber` (e.g., `ORD-X9J2...`) and `TransactionNumber`.
    - Prepares the Order object with `PENDING` status.
    - Prepares the Transaction object with `PENDING` status and `MANUAL` gateway.
4.  **Atomic Database Commit (Repository Layer)**:
    - A Prisma Interactive Transaction (`$transaction`) performs the following **all or nothing**:
      1.  **Create Order**: Inserts the order record.
      2.  **Create Order Items**: Inserts items linked to the order.
      3.  **Decrement Stock**: Updates product inventory.
      4.  **Create Transaction**: Inserts the financial record linked 1-to-1 with the Order.
5.  **Response**: Returns the `orderId`, `orderNumber`, and `totalAmount` to the client.

---

## 🗄️ Database Schema

The system uses **MongoDB** via **Prisma ORM**. Below are the core models defining the financial domain.

### **1. Order Model**

Represents the customer's intent to purchase. It tracks fulfillment and basic payment status.

```prisma
model Order {
  id          String @id @default(auto()) @map("_id") @db.ObjectId
  orderNumber String @unique

  // Relations
  customerId String   @db.ObjectId
  customer   Customer @relation(fields: [customerId], references: [id])

  items         OrderItem[]
  transaction   Transaction? // One-to-One relation

  // Pricing (Stored as snapshots)
  subtotal    Float
  taxAmount   Float
  shippingFee Float
  discount    Float @default(0)
  totalAmount Float

  // Statuses
  fulfillmentStatus FulfillmentStatus @default(PENDING) // PENDING, FULFILLED, CANCELED
  paymentStatus     PaymentStatus     @default(PENDING) // PENDING, COMPLETED, FAILED
  paymentMethod     PaymentMethod?    // CREDIT_CARD, PAYPAL, etc.

  // Embedded Addresses
  shippingAddress CustomerAddress?
  billingAddress  CustomerAddress?

  // Meta
  idempotencyKey String? @unique
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("orders")
}
```

### **2. OrderItem Model**

A snapshot of the product at the time of purchase. Even if the product name or price changes later, this record preserves the original history.

```prisma
model OrderItem {
  id String @id @default(auto()) @map("_id") @db.ObjectId

  orderId String @db.ObjectId
  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)

  productId String  @db.ObjectId
  product   Product @relation(fields: [productId], references: [id])

  // Snapshot Data
  productName  String
  productSku   String
  productImage String?

  quantity   Int
  unitPrice  Float
  totalPrice Float

  @@map("order_items")
}
```

### **3. Transaction Model**

Represents the financial event. It is strictly linked **1-to-1** with an Order. This separation allows handling retries, refunds, or complex payment logic without polluting the Order model.

```prisma
model Transaction {
  id                String @id @default(auto()) @map("_id") @db.ObjectId
  transactionNumber String @unique

  // One-to-One Relation
  orderId String @unique @db.ObjectId
  order   Order  @relation(fields: [orderId], references: [id])

  customerId String   @db.ObjectId
  customer   Customer @relation(fields: [customerId], references: [id])

  // Payment Details
  amount        Float
  currency      String         @default("USD")
  paymentStatus PaymentStatus  // PENDING, COMPLETED, FAILED
  paymentMethod PaymentMethod
  paymentGateway PaymentGateway @default(MANUAL) // MANAL, STRIPE, PAYPAL

  // Gateway Metadata (For future integration)
  gatewayTransactionId String?
  gatewayResponse      Json?

  // Troubleshooting
  failureReason String?
  webhookReceived   Boolean   @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("transactions")
}
```

### **4. Enums**

```prisma
enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  PAYPAL
  BANK_TRANSFER
  CASH_ON_DELIVERY
}

enum PaymentGateway {
  STRIPE
  PAYPAL
  RAZORPAY
  SQUARE
  MANUAL
}
```

---

## 🛠️ Key Design Decisions

1.  **Atomic Write**: We use `prisma.$transaction([])` to ensure we never have an Order created without a Transaction, or stock decremented without an Order.
2.  **Snapshotting**: `OrderItem` copies price/name from `Product`. This ensures historical accuracy for financial reporting.
3.  **One-to-One Transaction**: A single Order is linked to a single Transaction record for simplicity. If a payment fails and the user retries, we typically treat it as a new attempt update or a state change, but structurally we enforce one active transaction per order for this iteration.
4.  **Embedded Addresses**: Addresses are stored inside the Order document (in MongoDB) via the `CustomerAddress` composite type, rather than as separate collection relations. This improves read performance.
