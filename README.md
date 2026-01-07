# DealPort - High-Performance Full-Stack E-Commerce Infrastructure

**DealPort** is a sophisticated, production-ready administrative and storefront ecosystem designed to handle the complexities of modern e-commerce. Built with a decoupled architecture, it emphasizes high-performance data processing, real-time behavioral tracking, and intelligent automation.

---

## � System Architecture

The project is architected with a strict separation of concerns, ensuring that the administrative dashboard and the public storefront can scale independently while sharing a unified data engine.

### **The Decoupled Ecosystem**

- **Frontend (React/TypeScript)**: Deployed on Vercel, the frontend utilizes **Redux Toolkit** and **RTK Query** to manage a centralized application state. It implements advanced caching patterns to minimize redundant API calls and provide a fluid, single-page application experience.
- **Backend (Node.js/Express/TypeScript)**: Deployed on Railway, the backend serves as a stateless API layer. It is built using the **Layered Architecture Pattern**:
  - **Route Layer**: Handles HTTP methods and endpoint definitions.
  - **Controller Layer**: Manages request parsing, Zod-based validation, and response serialization.
  - **Service Layer**: Encapsulates core business logic, coordinating between repositories and external integrations like OpenAI.
  - **Repository Layer**: Abstracts database operations using **Prisma ORM**, ensuring type-safe interactions with MongoDB.

---

## 🛣 Dual-Routing Logic: Admin vs. Storefront

The backend implements two distinct routing systems, each tailored to specific security and performance requirements.

### **1. Administrative (Admin) Routes (`/api/admin/*`)**

Designed for internal operations, these routes are protected by robust JWT-based authentication and specialized middleware.

- **Dashboard & Analytics**:
  - Aggregated snapshots of revenue, orders, and customer growth trends.
  - Real-time counters for active visitors and device distribution.
- **Catalog Management**:
  - Full CRUD operations for Products and Categories.
  - Bulk actions for stock management and visibility toggling.
- **Order Fulfillment Center**:
  - Tracking the complete lifecycle of an order from `PENDING` to `DELIVERED`.
  - Managing payment statuses and fulfillment logs.
- **Customer CRM**:
  - Centralized view of customer profiles, purchase history, and lifetime value (LTV).
  - Management of segmentation and registration status.
- **System Operations**:
  - Configuration of global promotional coupons and monthly sales targets.

### **2. Storefront Routes (`/api/storefront/*`)**

Optimized for public interaction and performance, these routes power the customer-facing experience.

- **Personalized Sessions**:
  - Anonymous session initialization allowing for pre-login activity tracking.
  - Mapping guest behavior to registered profiles upon checkout or account creation.
- **Interaction & Engagement**:
  - **Reviews**: Capturing customer feedback and calculating real-time product ratings.
  - **Coupons**: Validating promotional codes against global constraints during the checkout flow.
- **Transaction Entry**:
  - Streamlined checkout endpoints that process orders and initiate payment sequences.
- **Behavioral Tracking**:
  - Capturing granular page views and interaction events to build a cohesive conversion funnel.

---

## AI Integration

- **OpenAI GPT-4o Integration**:
  - **SEO-Ready Descriptions**: The "Magic Wand" feature automatically generates professional, SEO-optimized product descriptions from a simple product name.
  - **Profile Enhancement**: A professional biography refiner for admin profiles, ensuring data entry remains polished and consistent.

---

## Performance Optimization

To ensure the platform remains responsive even under heavy traffic or large datasets, several strategic optimizations were implemented.

### **1. Proactive Aggregation (Cron Jobs)**

To provide instantaneous data for long-term charts, the system avoids "On-The-Fly" calculations:

- **Daily Metrics Engine**: A scheduled job (`analytics.job.ts`) processes all of the previous day's data (orders, sales, new customers).
- **Data Snapshots**: Results are saved as single `DailyMetric` records, allowing 6-month or 1-year charts to load by querying just 180 records instead of thousands.

### **2. Optimized Data Denormalization**

The MongoDB schema uses intentional data duplication to ensure lightning-fast read operations:

- **Order Immutability**: `OrderItem` records store hard-copies of product details (Name, SKU, Price) at the moment of purchase. This guarantees historical report accuracy even if original products are deleted or changed later.
- **Customer Rollups**: Atomic fields like `totalSpent` and `totalOrders` are maintained on the `Customer` record, allowing for high-performance sorting in the CRM.

---

## 🔒 Security & Data Integrity

- **JWT Rotation Flow**: Implements a secure Access/Refresh token pattern. Refresh tokens are rotated on usage, minimizing the impact of potential leaks.
- **Cookie Security**: All sensitive tokens are stored in **HTTP-only, Secure** cookies with `SameSite: None` configuration, enabling secure cross-site communication between Vercel and Railway.
- **Validation Architecture**: Every entry point is guarded by **Zod schemas**, ensuring that corrupt or malicious data never reaches the service layer.
- **CORS Management**: Strict origin whitelisting across the backend production environment.

---

## 📋 Technical Project Structure

```text
├── backened/
│   ├── src/
│   │   ├── controllers/    # Request handling & Validation
│   │   ├── services/       # Business logic (AI, Analytics, Orders)
│   │   ├── repositories/   # Data access layer (Prisma)
│   │   ├── middlewares/    # Auth, Session Tracking, Error Handling
│   │   ├── routes/
│   │   │   ├── admin/      # Multi-module admin routes
│   │   │   └── storefront/ # Customer-facing routes
│   │   ├── jobs/           # Scheduled background tasks
│   │   └── config/         # Redis, DB, and Env configuration
│   └── prisma/             # Schema definitions
├── frontened/
│   ├── src/
│   │   ├── components/     # UI Design System
│   │   ├── lib/store/      # Redux & RTK Query configuration
│   │   ├── pages/          # Dashboard & Feature views
│   │   └── hooks/          # Custom business logic hooks
```

---

## 🏁 How to Get Started

### **Prerequisites**

- Node.js v18+
- MongoDB Atlas or Local Instance
- Upstash Redis Instance
- OpenAI / Gemini API Keys

### **Setup Flow**

1.  **Clone the Repo**: `git clone [repository-url]`
2.  **Environment Configuration**: Create `.env` files in both `backened` and `frontened` directories.
3.  **Install Dependencies**: Run `npm install` in both directories.
4.  **Database Migration**: Run `npx prisma db push` in the backend directory.
5.  **Start Development**: Run `npm run dev` in both terminals.

---

## 📜 Summary of Implementation

This project was approached with a **"Performance-First"** mindset. Every feature—from the intelligent session tracking to the background data aggregation—is designed to handle the scale of a real-world e-commerce environment. By leveraging a modern tech stack and thoughtful architectural patterns, DealPort provides a seamless experience for both administrators and customers.
