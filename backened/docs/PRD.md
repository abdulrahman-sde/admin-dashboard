# Product Requirements Document (PRD)

## DEALPORT - Admin Dashboard System

**Version:** 1.0  
**Date:** December 6, 2025  
**Product Owner:** Dealport Team  
**Document Status:** Draft

---

## 1. Executive Summary

DEALPORT is a comprehensive admin dashboard system designed to manage e-commerce operations, customer relationships, product inventory, and business analytics. The platform provides administrators with powerful tools to oversee orders, manage customers, track transactions, analyze reports, and maintain product catalogs across multiple categories.

---

## 2. Product Overview

### 2.1 Vision

To create an intuitive, feature-rich admin dashboard that empowers administrators to efficiently manage all aspects of their e-commerce business from a single unified platform.

### 2.2 Target Users

- **Primary:** Business administrators and managers
- **Secondary:** Customer service representatives, inventory managers, sales analysts

### 2.3 Core Value Proposition

- Centralized management of all business operations
- Real-time analytics and reporting
- Streamlined customer and order management
- Comprehensive product catalog control
- Secure role-based access control

---

## 3. Technical Stack

### 3.1 Backend

- **Runtime:** Node.js with Express.js v5.2.1
- **Language:** TypeScript v5.9.3
- **Database:** MongoDB with Prisma ORM v6.19
- **Authentication:** JWT-based authentication with refresh tokens
- **Security:** bcrypt for password hashing, HTTP-only cookies

### 3.2 Frontend

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **State Management:** React Context API

### 3.3 Architecture

- RESTful API design
- Server-side rendering (SSR)
- Role-based access control (RBAC)
- Soft delete pattern for data integrity

---

## 4. User Roles & Permissions

### 4.1 Admin Role

- Full access to all modules
- User management (CRUD operations)
- System configuration
- Advanced analytics access

### 4.2 User Role

- Limited access to specific modules
- View-only permissions for sensitive data
- No user management capabilities

---

## 5. Feature Requirements

## 5.1 Dashboard (Home)

### 5.1.1 Key Metrics Overview

**Priority:** P0 (Must Have)

**User Story:**  
As an administrator, I want to see key business metrics at a glance so that I can monitor overall business performance.

**Functional Requirements:**

- Display total sales with trend indicators (last 7 days)
  - Current value: $350K
  - Growth percentage: +10.4%
  - Previous period comparison
- Show total orders with trend
  - Current value: 10.7K orders
  - Growth percentage: +14.4%
- Display pending & canceled orders breakdown
  - Pending: 509 orders (over 204)
  - Canceled: 94 orders (4.76%)
  - Individual detail views

**Acceptance Criteria:**

- Metrics update in real-time
- Percentage changes accurately calculated
- Comparison periods clearly labeled
- Click-through to detailed views functional

### 5.1.2 Weekly Performance Report

**Priority:** P0

**Functional Requirements:**

- Display weekly metrics:
  - Customers: 52k
  - Total Products: 3.5k
  - Stock Products: 2.5k
  - Out of Stock: 0.5k
  - Revenue: 250k
- Interactive chart showing weekly trends
- Toggle between "This week" and "Last week" views
- Tooltip showing exact values on hover

### 5.1.3 User Activity Timeline

**Priority:** P1 (Should Have)

**Functional Requirements:**

- Display "Users in last 30 minutes": 21.5K
- Show "Users per minute" graph with real-time updates
- Line chart visualization with time-based data points

### 5.1.4 Sales by Country

**Priority:** P1

**Functional Requirements:**

- Country flags with percentages:
  - USA: 30k
  - Brazil: 30k
  - Australia: 26k
- Progress bars showing comparative sales
- Percentage change indicators
- "View Insight" link for detailed analytics

### 5.1.5 Transaction Overview

**Priority:** P0

**Functional Requirements:**

- Display recent transactions with:
  - Transaction number
  - Customer ID
  - Order date and time
  - Status (Paid/Pending)
  - Amount
- Filter by status
- Pagination support
- "Details" link for each transaction

### 5.1.6 Top Products Widget

**Priority:** P1

**Functional Requirements:**

- List top 4 selling products with:
  - Product image
  - Product name
  - SKU (Item #FXZ-4567)
  - Price
- "All result" link to full product list

### 5.1.7 Best Selling Products

**Priority:** P1

**Functional Requirements:**

- Tabular view with columns:
  - Product name with image
  - Total orders
  - Status (Stock/Stock out)
  - Price
- Filter functionality
- "Details" button for each product

### 5.1.8 Quick Add Product

**Priority:** P1

**Functional Requirements:**

- Category selection dropdown:
  - Electronic
  - Fashion
  - Home
- Quick add buttons for featured products
- "See more" expandable section

---

## 5.2 Order Management

### 5.2.1 Order Overview

**Priority:** P0

**User Story:**  
As an administrator, I want to manage all customer orders efficiently so that I can ensure timely fulfillment and customer satisfaction.

**Functional Requirements:**

- View all orders in a paginated table
- Filter orders by status (All/Pending/Processing/Shipped/Delivered)
- Search orders by order ID, customer name, or product
- Sort by date, amount, status
- Bulk action support
- Export order data

**Data Fields:**

- Order ID
- Customer name
- Order date
- Items count
- Total amount
- Payment method
- Status
- Action buttons (View/Edit/Cancel)

---

## 5.3 Customer Management

### 5.3.1 Customer Dashboard

**Priority:** P0

**User Story:**  
As an administrator, I want to view and manage customer data so that I can maintain customer relationships and analyze customer behavior.

**Functional Requirements:**

#### Customer Metrics

- **Total Customers:** 11,040 (+14.4% from last 7 days)
- **New Customers:** 2,370 (+20%)
- **Visitor Count:** 250k (+30% from last 7 days)

#### Customer Overview Analytics

- Display metrics:
  - Active customers: 25k
  - Repeat customers: 5.6k
  - Step visitors: 250k
  - Conversion Rate: 5.5%
- Weekly trend graph with time-series data
- Interactive chart with date selection

#### Customer Data Table

- Display fields:
  - Customer ID (e.g., #CUST001)
  - Name
  - Phone number
  - Order count
  - Total spend
  - Status (Active/Inactive/VIP)
  - Action buttons (Edit/View/Delete)

**Functional Requirements:**

- Search customers by ID, name, or phone
- Filter by status
- Sort by any column
- Pagination (24 pages shown)
- Export customer data
- "Add Customer" button

**Acceptance Criteria:**

- All customer data loads within 2 seconds
- Search returns results within 1 second
- Pagination works smoothly
- Export generates CSV/Excel files

---

## 5.4 Categories Management

### 5.4.1 Category Organization

**Priority:** P0

**User Story:**  
As an administrator, I want to organize products into categories so that customers can easily find what they're looking for.

**Functional Requirements:**

#### Category Discovery Section

- Display category cards with:
  - Category icon/image
  - Category name
  - Visual representation
- Categories include:
  - Electronics
  - Fashion
  - Accessories
  - Home & Kitchen
  - Sports & Outdoors
  - Toys & Games
  - Health & Fitness
  - Books
- Carousel navigation for additional categories
- "Add Product" button
- "More Action" dropdown menu

#### Product List View

- Tabs for filtering:
  - All Products (149 total)
  - Featured Products
  - On Sale
  - Out of Stock
- Search products functionality
- Filter, add, and action buttons

#### Product Data Table

- Display columns:
  - No. (row number)
  - Product (with thumbnail image and name)
  - Created Date (e.g., 01-01-2025)
  - Order (quantity)
  - Action buttons (Edit/Delete)
- Products shown:
  - Wireless Bluetooth Headphones: 25 orders
  - Men's T-Shirt: 20 orders
  - Men's Leather Wallet: 35 orders
  - Memory Foam Pillow: 40 orders
  - Coffee Maker: 45 orders
  - Casual Baseball Cap: 55 orders
  - Full HD Webcam: 20 orders
  - Smart LED Color Bulb: 16 orders
  - Men's T-Shirt: 10 orders
  - Men's Leather Wallet: 35 orders

**Functional Requirements:**

- Drag-and-drop category reordering
- Create/Edit/Delete categories
- Assign products to multiple categories
- Category hierarchy support (parent/child)
- Pagination (24 pages)

---

## 5.5 Transaction Management

### 5.5.1 Transaction Overview

**Priority:** P0

**User Story:**  
As an administrator, I want to track all financial transactions so that I can monitor revenue and identify payment issues.

**Functional Requirements:**

#### Transaction Metrics

- **Total Revenue:** $15,045 (+14.4% from last 7 days)
- **Completed Transactions:** 3,150 (+20% from last 7 days)
- **Pending Transactions:** 150 (16% from last 7 days)
- **Failed Transactions:** 75 (15% from last 7 days)

#### Payment Method Card

- Display active payment method:
  - Card type (Finco)
  - Card number (masked): •••• •••• •••• 2345
  - Cardholder name: Hannah Moreno
  - Expiry: 02-30
  - Status: Active
  - Transactions: 1,250
  - Revenue: $50,000
- "Add Card" button
- "Deactivate" option
- "View Transactions" link

#### Transaction History Table

- Filter tabs:
  - All orders (240 total)
  - Completed
  - Pending
  - Canceled
- Search payment history
- Display columns:
  - Customer ID
  - Name
  - Date (e.g., 01-01-2025)
  - Total amount (e.g., $2,904)
  - Method (CC/PayPal/Bank)
  - Status (Complete/Pending/Canceled)
  - Action (View Details)
- Status indicators with color coding:
  - Green: Complete
  - Yellow: Pending
  - Red: Canceled

**Functional Requirements:**

- Real-time transaction updates
- Filter by payment method, status, date range
- Search by customer ID or name
- Export transaction reports
- Pagination support (24 pages)
- Drill-down to transaction details

---

## 5.6 Reports & Analytics

### 5.6.1 Customer Growth Analytics

**Priority:** P1

**User Story:**  
As an administrator, I want to analyze customer growth trends so that I can make data-driven marketing decisions.

**Functional Requirements:**

#### Customer Growth Chart

- Bar chart showing monthly data for last 12 months
- Two data series:
  - Returning customers (purple bars)
  - New customers (green bars)
- Time range selector: "Last 12 Months"
- Y-axis scale: 0-500 customers
- Monthly breakdown (Jan-Dec)

#### Customer Metrics Summary

- **Existing Users:** 5,653 (22.48% increase)
- **New Users:** 1,650 (15.34% increase)
- **Total Visits:** 9,504 (18.50% decrease - shown in red)
- **Unique Visits:** 5,423 (10.54% decrease - shown in red)

#### Sales Performance Metrics

- **Sales Goal:** 75% complete
  - Target: $15,000
  - Month goal: $20,000
  - Left to achieve: $5,000
- **Conversion Rate:** 25%
  - Cart: 35%
  - Checkout: 25%
  - Purchase: 25%
- **Average Order Value:** $48.90 this month, $88.90 previous month
  - Line graph showing trend over time
  - Monthly data points (Apr-Dec)

#### Customer Demographics

- Geographic distribution map showing:
  - **United States:** 29,051 customers (green)
  - **Europe:** 18,041 customers (orange)
  - **Australia:** 10,430 customers (red)
  - **Other:** 5,420 customers (gray)
- Interactive world map with zoom capabilities

#### Visits by Device

- Device breakdown:
  - **Mobile:** 92%
  - **Laptop:** 20%
  - **Tablet:** 13%
  - **Other:** 5%

#### Online Sessions

- **Active Users:** 128 (currently online indicator)

#### Top Customers Table

- Display columns:
  - Avatar
  - Name
  - Orders count
  - Spent amount
- Top 5 customers:
  1. Lee Henry: 82 orders, $968.57
  2. Myste McBride: 43 orders, $903.54
  3. Tommy Walker: 41 orders, $726.90
  4. Lela Cannon: 38 orders, $679.12
  5. Jimmy Cook: 34 orders, $545.73

#### Top Products Table

- Display columns:
  - Product image
  - Name
  - Clicks
  - Units Sold
- Top 5 products:
  1. Men White T-Shirt: 12,040 clicks, 106 sold
  2. Women White T-Shirt: 11,234 clicks, 146 sold
  3. Women Striped T-Shirt: 10,054 clicks, 122 sold
  4. Men Grey Hoodie: 8,405 clicks, 110 sold
  5. Women Red T-Shirt: 5,800 clicks, 87 sold

**Functional Requirements:**

- Date range filtering (daily/weekly/monthly/yearly)
- Export reports as PDF/Excel
- Scheduled report generation
- Email delivery of reports
- Customizable dashboard widgets
- Drill-down capabilities for detailed analysis

---

## 5.7 Admin Profile Management

### 5.7.1 Profile View

**Priority:** P1

**User Story:**  
As an administrator, I want to view and manage my profile so that I can keep my information current and secure.

**Functional Requirements:**

#### Profile Card

- Display:
  - Profile photo (circular avatar)
  - Full name: Wade Warren
  - Email: wade.warren@example.com
  - Copy email button
- Social media links:
  - Google
  - Facebook
  - X (Twitter)
  - LinkedIn
- "Social media" connection button
- Edit and share icons

#### Profile Update Form

- **Personal Information:**

  - First Name: Wade
  - Last Name: Warren
  - Password: ••••••••• (with show/hide toggle)
  - Phone Number: (400) 555-0120 (with country selector - US flag)
  - E-mail: wade.warren@example.com
  - Date of Birth: 12-January-1999 (with calendar picker)
  - Location: 2972 Westheimer Rd. Santa Ana, Illinois 85486
  - Credit Card: 843-4359-4444 (with Mastercard icon)
  - Biography: "Enter a biography about you" (textarea)

- **Profile Actions:**
  - "Upload New" photo button
  - "Delete" photo button
  - "Edit" button (top right)

#### Change Password Section

- Current Password field
- "Forgot Current Password? Click here" link
- New Password field
- Re-enter Password field
- Password visibility toggle icons
- "Save Change" button (green)
- "Need help" link with info icon

**Functional Requirements:**

- Profile photo upload (max 5MB, JPG/PNG)
- Real-time form validation
- Password strength indicator
- Phone number formatting
- Email verification on change
- Social media OAuth integration
- Activity log tracking
- Two-factor authentication option

**Acceptance Criteria:**

- All fields validate before submission
- Changes save within 2 seconds
- Success/error notifications display
- Password change requires current password verification
- Profile photo preview before upload

---

## 6. Non-Functional Requirements

### 6.1 Performance

- Page load time: < 3 seconds
- API response time: < 500ms
- Support for 1000+ concurrent users
- Database query optimization

### 6.2 Security

- HTTPS encryption for all communications
- JWT tokens expire after 15 minutes (access) / 7 days (refresh)
- HTTP-only cookies prevent XSS attacks
- Password minimum 8 characters with complexity requirements
- Rate limiting on API endpoints
- SQL injection prevention via Prisma ORM
- CORS configuration
- Input sanitization and validation

### 6.3 Scalability

- Horizontal scaling support
- Database connection pooling
- CDN for static assets
- Caching strategy (Redis recommended)
- Load balancing capability

### 6.4 Usability

- Responsive design (mobile, tablet, desktop)
- Intuitive navigation
- Consistent UI/UX patterns
- Accessibility compliance (WCAG 2.1 AA)
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)

### 6.5 Reliability

- 99.9% uptime SLA
- Automated backups (daily)
- Disaster recovery plan
- Error logging and monitoring
- Graceful error handling

---

## 7. Database Schema

### 7.1 Current Schema (MongoDB with Prisma)

```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 7.2 Required Schema Extensions

Based on the dashboard features, the following models are needed:

#### Customer Model

```prisma
model Customer {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  customerId  String   @unique // e.g., #CUST001
  name        String
  email       String   @unique
  phone       String
  orderCount  Int      @default(0)
  totalSpend  Float    @default(0)
  status      CustomerStatus
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?
  orders      Order[]
}

enum CustomerStatus {
  ACTIVE
  INACTIVE
  VIP
}
```

#### Product Model

```prisma
model Product {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  sku         String   @unique
  description String?
  price       Float
  image       String?
  stock       Int      @default(0)
  categoryId  String   @db.ObjectId
  category    Category @relation(fields: [categoryId], references: [id])
  orders      Int      @default(0)
  status      ProductStatus
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?
}

enum ProductStatus {
  IN_STOCK
  OUT_OF_STOCK
  FEATURED
  ON_SALE
}
```

#### Category Model

```prisma
model Category {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  name      String    @unique
  icon      String?
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

#### Order Model

```prisma
model Order {
  id            String      @id @default(auto()) @map("_id") @db.ObjectId
  orderNumber   String      @unique
  customerId    String      @db.ObjectId
  customer      Customer    @relation(fields: [customerId], references: [id])
  items         OrderItem[]
  totalAmount   Float
  status        OrderStatus
  paymentMethod PaymentMethod
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELED
}

enum PaymentMethod {
  CC
  PAYPAL
  BANK
}
```

#### Transaction Model

```prisma
model Transaction {
  id              String            @id @default(auto()) @map("_id") @db.ObjectId
  transactionId   String            @unique
  customerId      String
  customerName    String
  amount          Float
  paymentMethod   PaymentMethod
  status          TransactionStatus
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}

enum TransactionStatus {
  COMPLETED
  PENDING
  FAILED
  CANCELED
}
```

---

## 8. API Endpoints

### 8.1 Authentication

- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### 8.2 Users (Admin Management)

- `GET /api/users` - List all admin users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (soft delete)

### 8.3 Customers

- `GET /api/customers` - List all customers (with pagination, filters)
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/stats` - Get customer metrics

### 8.4 Products

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/top` - Get top selling products

### 8.5 Categories

- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category details
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### 8.6 Orders

- `GET /api/orders` - List all orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Cancel order
- `GET /api/orders/stats` - Get order metrics

### 8.7 Transactions

- `GET /api/transactions` - List all transactions
- `GET /api/transactions/:id` - Get transaction details
- `GET /api/transactions/stats` - Get transaction metrics

### 8.8 Reports

- `GET /api/reports/dashboard` - Get dashboard metrics
- `GET /api/reports/sales` - Get sales analytics
- `GET /api/reports/customers` - Get customer analytics
- `GET /api/reports/revenue` - Get revenue reports
- `POST /api/reports/export` - Export reports

---

## 9. Development Roadmap

### Phase 1: Foundation (Weeks 1-2)

- ✅ Backend setup (Express, TypeScript, Prisma)
- ✅ Authentication system (JWT)
- ✅ User management CRUD
- Database schema design for all models
- API endpoint structure

### Phase 2: Core Features (Weeks 3-5)

- Customer management module
- Product management module
- Category management module
- Order management module
- Transaction tracking

### Phase 3: Analytics & Reporting (Weeks 6-7)

- Dashboard metrics and widgets
- Sales analytics
- Customer growth reports
- Revenue tracking
- Chart implementations

### Phase 4: UI/UX Polish (Week 8)

- Responsive design refinement
- Profile management
- Advanced filtering and search
- Export functionality
- Performance optimization

### Phase 5: Testing & Deployment (Week 9-10)

- Unit testing
- Integration testing
- Security audit
- Performance testing
- Production deployment

---

## 10. Success Metrics

### 10.1 User Engagement

- Daily active administrators: Target 80%+ login rate
- Average session duration: > 15 minutes
- Feature adoption rate: > 60% for core features

### 10.2 Performance

- Page load time: < 2 seconds average
- API response time: < 300ms average
- System uptime: 99.9%

### 10.3 Business Impact

- Time to complete admin tasks: 50% reduction
- Order processing time: 30% improvement
- Customer query resolution time: 40% improvement
- Data accuracy: 99.5%+

---

## 11. Risks & Mitigation

### 11.1 Technical Risks

- **Risk:** Database performance degradation with large datasets

  - **Mitigation:** Implement indexing, pagination, caching

- **Risk:** Security vulnerabilities

  - **Mitigation:** Regular security audits, dependency updates, penetration testing

- **Risk:** Third-party service downtime
  - **Mitigation:** Graceful degradation, fallback mechanisms

### 11.2 Business Risks

- **Risk:** Low user adoption

  - **Mitigation:** User training, intuitive UI, comprehensive documentation

- **Risk:** Scope creep
  - **Mitigation:** Strict prioritization, phased rollout, stakeholder alignment

---

## 12. Dependencies

### 12.1 External Services

- MongoDB Atlas (database hosting)
- Email service (for notifications)
- Cloud storage (for file uploads)
- Analytics service (optional)

### 12.2 Third-Party Libraries

- Express.js - Web framework
- Prisma - ORM
- JWT - Authentication
- bcrypt - Password hashing
- Zod - Validation
- shadcn/ui - UI components
- Tailwind CSS - Styling

---

## 13. Future Enhancements

### 13.1 Short-term (3-6 months)

- Email notifications for order updates
- Advanced search with filters
- Bulk operations
- Export to multiple formats (CSV, PDF, Excel)
- Dark mode support

### 13.2 Long-term (6-12 months)

- Multi-language support (i18n)
- Advanced analytics with AI insights
- Mobile app for administrators
- Inventory management system
- Supplier management
- Automated reporting schedules
- Integration with payment gateways
- Integration with shipping providers
- API for third-party integrations
- Webhook support

---

## 14. Appendices

### 14.1 Glossary

- **PRD:** Product Requirements Document
- **CRUD:** Create, Read, Update, Delete
- **JWT:** JSON Web Token
- **ORM:** Object-Relational Mapping
- **RBAC:** Role-Based Access Control
- **API:** Application Programming Interface
- **UI/UX:** User Interface/User Experience

### 14.2 References

- Claude AI Chat: https://claude.ai/share/722bd97a-94b5-408d-8d5b-c21861561220
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- shadcn/ui: https://ui.shadcn.com

### 14.3 Change Log

- **v1.0** (December 6, 2025) - Initial PRD creation

---

## 15. Approval

**Prepared By:** GitHub Copilot  
**Review Status:** Pending  
**Approval Status:** Draft

---

_This document is confidential and intended for internal use only._
