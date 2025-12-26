# API Documentation

This document provides a detailed reference for the RESTful API endpoints available in the application.

## Base URL

All API requests should be prefixed with `/api`.
For example: `http://localhost:3000/api/v1` (assuming v1 is used, or just /api).
_Note: Check `src/index.ts` or `src/app.ts` to confirm the base path._

---

## Authentication (`/auth`)

### Register

Create a new admin user.

- **Endpoint:** `POST /admin/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "name": "Jane Doe"
  }
  ```

### Login

Authenticate an existing user and receive a cookie/session.

- **Endpoint:** `POST /admin/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

### Logout

Invalidate the current session.

- **Endpoint:** `POST /admin/auth/logout`

### Get Current User

Retrieve profile information for the currently authenticated user.

- **Endpoint:** `GET /admin/auth/me`

---

## Analytics (`/analytics`)

### Get Two Week Stats

Retrieve aggregated dashboard metrics for the current and previous week.

- **Endpoint:** `GET /admin/analytics/two-week-stats`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Stats fetched successfully",
    "data": {
      "orders": { "thisWeek": { ... }, "previousWeek": { ... } },
      "customers": { ... },
      "transactions": { ... },
      "products": { ... }
    }
  }
  ```

---

## Products (`/products`)

### List Products

Retrieve a paginated list of products with optional filtering.

- **Endpoint:** `GET /admin/products`
- **Query Parameters:**
  - `page`: (number) Page number (default: 1)
  - `limit`: (number) Items per page (default: 10)
  - `search`: (string) Search by name
  - `category`: (string) Filter by category slug
  - `status`: (enum: DRAFT, PUBLISHED, ARCHIVED)
- **Response:**
  ```json
  {
    "data": [ ...product objects... ],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 10
    }
  }
  ```

### Create Product

- **Endpoint:** `POST /admin/products`
- **Body:**
  ```json
  {
    "name": "T-Shirt",
    "price": 29.99,
    "stockQuantity": 100,
    "categoryId": "category_id_here",
    "images": ["url1", "url2"],
    "description": "Cotton t-shirt"
  }
  ```

### Build/Update Product (Specific ID)

- **Endpoint:** `PATCH /admin/products/:id`
- **Endpoint:** `DELETE /admin/products/:id`

---

## Orders (`/orders`) of Admin

### List Orders

- **Endpoint:** `GET /admin/orders`
- **Query Parameters:**
  - `search`: Search by order number or customer email
  - `fulfillmentStatus`: Filter by status
  - `paymentStatus`: Filter by payment status
  - `startDate`, `endDate`: Date range filters

### Update Order Status

Update the fulfillment or payment status of an order. Syncs automatically with Transaction status.

- **Endpoint:** `PATCH /admin/orders/:id`
- **Body:**
  ```json
  {
    "fulfillmentStatus": "SHIPPED",
    "paymentStatus": "COMPLETED"
  }
  ```
  - **Valid Fulfillment Statuses:** `PENDING`, `PROCESSING`, `PACKED`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `RETURNED`, `CANCELED`
  - **Valid Payment Statuses:** `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`

---

## Storefront Orders (`/storefront/orders`)

### Create Order (Public/Storefront)

Places a new order. Handles Guest and Registered customers.

- **Endpoint:** `POST /storefront/orders`
- **Body (Guest):**
  ```json
  {
    "customer": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "555-5555"
    },
    "items": [
      { "productId": "prod_id_1", "quantity": 1 }
    ],
    "shippingAddress": { ... },
    "billingAddress": { ... },
    "paymentMethod": "CASH_ON_DELIVERY",
    "shippingFee": 10
  }
  ```
- **Body (Registered):**
  ```json
  {
    "customerId": "cust_id_123",
    "items": [ ... ],
    "paymentMethod": "CREDIT_CARD",
    ...
  }
  ```
- **Notes:**
  - If `paymentMethod` is `CASH_ON_DELIVERY`, initial status is `PENDING`.
  - If `paymentMethod` is any other value (e.g., `CREDIT_CARD`), initial status is `COMPLETED` (simulated).
  - Product Name and Images are strictly fetched from the database, ignoring any client inputs for those fields.

---

## Customers (`/customers`)

### List Customers

- **Endpoint:** `GET /admin/customers`

### Create Customer

- **Endpoint:** `POST /admin/customers`
- **Body:**
  ```json
  {
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice@example.com",
    "phone": "12345678"
  }
  ```

### Update/Delete Customer

- **Endpoint:** `PATCH /admin/customers/:id`
- **Endpoint:** `DELETE /admin/customers/:id`

---

## Coupons (`/coupons`)

- **Endpoint:** `GET /admin/coupons`
- **Endpoint:** `POST /admin/coupons`
- **Endpoint:** `DELETE /admin/coupons/:id`

## Categories (`/categories`)

- **Endpoint:** `GET /admin/categories`
- **Endpoint:** `POST /admin/categories`

## Search (`/search`)

- **Endpoint:** `GET /admin/search?q=query`
  Global search across products, orders, and customers.
