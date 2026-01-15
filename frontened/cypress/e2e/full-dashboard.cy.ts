/// <reference types="cypress" />

const api = "**/api/admin";

// Mock data
const mockCoupons = [
  {
    id: "coupon-1",
    code: "SUMMER25",
    name: "Summer Sale",
    type: "PERCENTAGE",
    value: 25,
    startDate: "2025-06-01T00:00:00.000Z",
    endDate: "2025-08-31T23:59:59.000Z",
    usageLimit: 100,
    usageCount: 45,
    status: "ACTIVE",
    createdAt: "2025-05-15T10:00:00.000Z",
  },
  {
    id: "coupon-2",
    code: "WINTER50",
    name: "Winter Discount",
    type: "FIXED",
    value: 50,
    startDate: "2025-12-01T00:00:00.000Z",
    endDate: "2026-02-28T23:59:59.000Z",
    usageLimit: 200,
    usageCount: 120,
    status: "ACTIVE",
    createdAt: "2025-11-20T14:30:00.000Z",
  },
];

const mockCategories = [
  {
    id: "cat-1",
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
    visibility: true,
    _count: { products: 25 },
    createdAt: "2025-01-10T10:00:00.000Z",
  },
  {
    id: "cat-2",
    name: "Clothing",
    slug: "clothing",
    description: "Fashion and apparel",
    visibility: true,
    _count: { products: 50 },
    createdAt: "2025-02-15T12:00:00.000Z",
  },
];

const mockProducts = [
  {
    id: "prod-1",
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    sku: "IPH15PRO",
    price: 999.99,
    discountPrice: 899.99,
    stockQuantity: 50,
    status: "ACTIVE",
    isFeatured: true,
    category: { id: "cat-1", name: "Electronics" },
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200",
    totalSales: 150,
    createdAt: "2025-04-01T10:00:00.000Z",
  },
  {
    id: "prod-2",
    name: "Samsung Galaxy S24",
    slug: "samsung-galaxy-s24",
    sku: "SAMGS24",
    price: 899.99,
    discountPrice: null,
    stockQuantity: 30,
    status: "ACTIVE",
    isFeatured: false,
    category: { id: "cat-1", name: "Electronics" },
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200",
    totalSales: 80,
    createdAt: "2025-04-15T14:00:00.000Z",
  },
];

const mockCustomers = [
  {
    id: "cust-1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    status: "ACTIVE",
    totalOrders: 15,
    totalSpent: 2500.0,
    createdAt: "2025-01-05T10:00:00.000Z",
  },
  {
    id: "cust-2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+0987654321",
    status: "VIP",
    totalOrders: 45,
    totalSpent: 8500.0,
    createdAt: "2024-11-20T14:00:00.000Z",
  },
];

const mockOrders = [
  {
    id: "ord-1",
    orderNumber: "ORD-2025-001",
    customer: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
    status: "COMPLETED",
    total: 599.99,
    itemsCount: 2,
    createdAt: "2025-01-10T10:00:00.000Z",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-2025-002",
    customer: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
    },
    status: "PENDING",
    total: 299.5,
    itemsCount: 1,
    createdAt: "2025-01-12T14:00:00.000Z",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-2025-003",
    customer: {
      firstName: "Bob",
      lastName: "Wilson",
      email: "bob@example.com",
    },
    status: "CANCELED",
    total: 150.0,
    itemsCount: 3,
    createdAt: "2025-01-08T09:00:00.000Z",
  },
];

const mockTransactions = [
  {
    id: "txn-1",
    transactionId: "TXN-2025-001",
    orderId: "ord-1",
    customerId: "cust-1234567890",
    customer: { firstName: "John", lastName: "Doe" },
    amount: 599.99,
    status: "paid",
    paymentStatus: "COMPLETED",
    paymentMethod: "Credit Card",
    createdAt: "2025-01-10T10:05:00.000Z",
  },
  {
    id: "txn-2",
    transactionId: "TXN-2025-002",
    orderId: "ord-2",
    customerId: "cust-0987654321",
    customer: { firstName: "Jane", lastName: "Smith" },
    amount: 299.5,
    status: "pending",
    paymentStatus: "PENDING",
    paymentMethod: "PayPal",
    createdAt: "2025-01-12T14:05:00.000Z",
  },
  {
    id: "txn-3",
    transactionId: "TXN-2025-003",
    orderId: "ord-3",
    customerId: "cust-5678901234",
    customer: { firstName: "Bob", lastName: "Wilson" },
    amount: 150.0,
    status: "failed",
    paymentStatus: "FAILED",
    paymentMethod: "Credit Card",
    createdAt: "2025-01-08T09:05:00.000Z",
  },
  {
    id: "txn-4",
    transactionId: "TXN-2025-004",
    orderId: "ord-4",
    customerId: "cust-1122334455",
    customer: { firstName: "Alice", lastName: "Johnson" },
    amount: 450.0,
    status: "paid",
    paymentStatus: "COMPLETED",
    paymentMethod: "Credit Card",
    createdAt: "2025-01-09T11:30:00.000Z",
  },
  {
    id: "txn-5",
    transactionId: "TXN-2025-005",
    orderId: "ord-5",
    customerId: "cust-6677889900",
    customer: { firstName: "Charlie", lastName: "Brown" },
    amount: 275.25,
    status: "paid",
    paymentStatus: "COMPLETED",
    paymentMethod: "Debit Card",
    createdAt: "2025-01-11T16:20:00.000Z",
  },
  {
    id: "txn-6",
    transactionId: "TXN-2025-006",
    orderId: "ord-6",
    customerId: "cust-4455667788",
    customer: { firstName: "Diana", lastName: "Miller" },
    amount: 125.0,
    status: "pending",
    paymentStatus: "PENDING",
    paymentMethod: "PayPal",
    createdAt: "2025-01-13T09:15:00.000Z",
  },
];

function stubAuth() {
  cy.intercept("GET", `${api}/auth/me`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: {
        user: {
          id: "e2e-user",
          firstName: "E2E",
          lastName: "Admin",
          email: "e2e@example.com",
          avatar: "https://github.com/shadcn.png",
        },
      },
    },
  }).as("me");

  cy.intercept("POST", `${api}/auth/refresh`, {
    statusCode: 200,
    body: { success: true, message: "ok", data: {} },
  }).as("refresh");
}

function stubCoreData() {
  cy.intercept("GET", `${api}/analytics/two-week-stats`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: {
        orders: {
          thisWeek: {
            totalOrders: 25,
            totalSales: 5000,
            completedOrders: 20,
            cancelledOrders: 2,
            pendingOrders: 3,
            processingOrders: 0,
            shippedOrders: 0,
            newOrders: 5,
            averageOrderValue: 200,
            countrySales: {},
          },
          previousWeek: {
            totalOrders: 20,
            totalSales: 4000,
            completedOrders: 18,
            cancelledOrders: 1,
            pendingOrders: 1,
            processingOrders: 0,
            shippedOrders: 0,
            newOrders: 4,
            averageOrderValue: 200,
            countrySales: {},
          },
        },
        customers: {
          thisWeek: {
            newCustomers: 10,
            returningCustomers: 5,
            totalCustomers: 100,
            totalVisits: 500,
          },
          previousWeek: {
            newCustomers: 8,
            returningCustomers: 4,
            totalCustomers: 90,
            totalVisits: 450,
          },
        },
        transactions: {
          thisWeek: {
            completedTransactions: 20,
            pendingTransactions: 3,
            failedTransactions: 2,
          },
          previousWeek: {
            completedTransactions: 18,
            pendingTransactions: 1,
            failedTransactions: 1,
          },
        },
        products: {
          thisWeek: {
            totalProducts: 50,
            inStockProducts: 45,
            outOfStockProducts: 5,
          },
          previousWeek: {
            totalProducts: 48,
            inStockProducts: 44,
            outOfStockProducts: 4,
          },
          topProducts: [],
        },
      },
    },
  }).as("twoWeekStats");

  cy.intercept("GET", `${api}/coupons*`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: mockCoupons,
      pagination: {
        total: mockCoupons.length,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
  }).as("coupons");

  cy.intercept("GET", `${api}/categories*`, {
    statusCode: 200,
    body: { success: true, message: "ok", data: mockCategories },
  }).as("categories");

  cy.intercept("GET", `${api}/products*`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: mockProducts,
      pagination: {
        total: mockProducts.length,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      meta: { all: mockProducts.length, featured: 1, onSale: 1, outOfStock: 0 },
    },
  }).as("products");

  cy.intercept("GET", `${api}/customers*`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: mockCustomers,
      pagination: {
        total: mockCustomers.length,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
  }).as("customers");

  cy.intercept("GET", `${api}/orders*`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: mockOrders,
      pagination: {
        total: mockOrders.length,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
  }).as("orders");

  cy.intercept("GET", `${api}/transactions*`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: mockTransactions,
      pagination: {
        total: mockTransactions.length,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
  }).as("transactions");

  cy.intercept("GET", `${api}/reviews*`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
  }).as("reviews");

  cy.intercept("GET", `${api}/reports*`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: {
        customerGrowthData: [
          { month: "Jan", newCustomers: 120, returningCustomers: 80 },
          { month: "Feb", newCustomers: 150, returningCustomers: 95 },
          { month: "Mar", newCustomers: 180, returningCustomers: 110 },
          { month: "Apr", newCustomers: 200, returningCustomers: 130 },
          { month: "May", newCustomers: 220, returningCustomers: 145 },
          { month: "Jun", newCustomers: 250, returningCustomers: 160 },
          { month: "Jul", newCustomers: 280, returningCustomers: 175 },
          { month: "Aug", newCustomers: 300, returningCustomers: 190 },
          { month: "Sep", newCustomers: 320, returningCustomers: 200 },
          { month: "Oct", newCustomers: 350, returningCustomers: 220 },
          { month: "Nov", newCustomers: 380, returningCustomers: 240 },
          { month: "Dec", newCustomers: 400, returningCustomers: 260 },
        ],
        keyMetrics: {
          returningUsers: { value: "1,520", change: 12.5, isPositive: true },
          newUsers: { value: "2,840", change: 8.3, isPositive: true },
          totalVisits: { value: "15,420", change: 15.2, isPositive: true },
          uniqueVisits: { value: "8,650", change: 6.8, isPositive: true },
        },
        salesGoal: {
          percentage: 78,
          soldFor: 78000,
          monthGoal: 100000,
          left: 22000,
        },
        conversionRate: {
          percentage: 4.8,
          cart: 2500,
          checkout: 1200,
          purchase: 850,
        },
        avgOrderValue: {
          thisMonth: 245,
          prevMonth: 220,
          trend: [180, 195, 210, 220, 235, 245],
        },
        visitsByDevice: [
          { device: "Desktop", visits: 8500, percentage: 55 },
          { device: "Mobile", visits: 5200, percentage: 34 },
          { device: "Tablet", visits: 1720, percentage: 11 },
        ],
        onlineSessions: { value: 342, isPositive: true },
        topCustomers: [
          {
            id: "tc-1",
            name: "Alice Johnson",
            email: "alice@example.com",
            totalSpent: 12500,
            orders: 45,
          },
          {
            id: "tc-2",
            name: "Bob Williams",
            email: "bob@example.com",
            totalSpent: 9800,
            orders: 38,
          },
          {
            id: "tc-3",
            name: "Carol Davis",
            email: "carol@example.com",
            totalSpent: 8200,
            orders: 32,
          },
        ],
        topProducts: [
          { id: "tp-1", name: "iPhone 15 Pro", sales: 450, revenue: 449550 },
          {
            id: "tp-2",
            name: "Samsung Galaxy S24",
            sales: 320,
            revenue: 287680,
          },
          { id: "tp-3", name: "MacBook Pro", sales: 180, revenue: 359820 },
        ],
        customerLocations: [
          { country: "United States", customers: 4500, percentage: 45 },
          { country: "United Kingdom", customers: 1800, percentage: 18 },
          { country: "Germany", customers: 1200, percentage: 12 },
          { country: "Canada", customers: 900, percentage: 9 },
          { country: "Australia", customers: 600, percentage: 6 },
        ],
      },
    },
  }).as("reports");

  // Additional report endpoints
  cy.intercept("GET", `${api}/reports/demographics`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: [
        { country: "United States", customers: 4500 },
        { country: "United Kingdom", customers: 1800 },
        { country: "Germany", customers: 1200 },
      ],
    },
  });
  cy.intercept("GET", `${api}/reports/top-customers`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: [
        {
          id: "tc-1",
          name: "Alice Johnson",
          email: "alice@example.com",
          totalSpent: 12500,
          orders: 45,
        },
        {
          id: "tc-2",
          name: "Bob Williams",
          email: "bob@example.com",
          totalSpent: 9800,
          orders: 38,
        },
      ],
    },
  });
  cy.intercept("GET", `${api}/reports/top-products`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: [
        { id: "tp-1", name: "iPhone 15 Pro", sales: 450, revenue: 449550 },
        { id: "tp-2", name: "Samsung Galaxy S24", sales: 320, revenue: 287680 },
      ],
    },
  });
  cy.intercept("GET", `${api}/reports/active-sessions`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: { active: 342, trend: [280, 295, 310, 325, 340, 342] },
    },
  });
  cy.intercept("GET", `${api}/reports/device-analytics`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: {
        devices: [
          { device: "Desktop", visits: 8500, percentage: 55 },
          { device: "Mobile", visits: 5200, percentage: 34 },
          { device: "Tablet", visits: 1720, percentage: 11 },
        ],
      },
    },
  });

  // Analytics endpoints
  cy.intercept("GET", `${api}/analytics/detailed-daily-metrics*`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: {
        report: {
          thisWeek: [
            {
              date: "2025-01-09",
              orders: 15,
              revenue: 3500,
              customers: 8,
              totalProducts: 50,
              stockProducts: 45,
              outOfStock: 5,
            },
            {
              date: "2025-01-10",
              orders: 18,
              revenue: 4200,
              customers: 10,
              totalProducts: 50,
              stockProducts: 45,
              outOfStock: 5,
            },
            {
              date: "2025-01-11",
              orders: 22,
              revenue: 5100,
              customers: 12,
              totalProducts: 52,
              stockProducts: 47,
              outOfStock: 5,
            },
            {
              date: "2025-01-12",
              orders: 20,
              revenue: 4800,
              customers: 11,
              totalProducts: 52,
              stockProducts: 47,
              outOfStock: 5,
            },
            {
              date: "2025-01-13",
              orders: 25,
              revenue: 5500,
              customers: 14,
              totalProducts: 55,
              stockProducts: 50,
              outOfStock: 5,
            },
            {
              date: "2025-01-14",
              orders: 28,
              revenue: 6200,
              customers: 16,
              totalProducts: 55,
              stockProducts: 50,
              outOfStock: 5,
            },
            {
              date: "2025-01-15",
              orders: 30,
              revenue: 7000,
              customers: 18,
              totalProducts: 58,
              stockProducts: 52,
              outOfStock: 6,
            },
          ],
          lastWeek: [
            {
              date: "2025-01-02",
              orders: 12,
              revenue: 2800,
              customers: 6,
              totalProducts: 48,
              stockProducts: 43,
              outOfStock: 5,
            },
            {
              date: "2025-01-03",
              orders: 14,
              revenue: 3200,
              customers: 7,
              totalProducts: 48,
              stockProducts: 43,
              outOfStock: 5,
            },
            {
              date: "2025-01-04",
              orders: 16,
              revenue: 3600,
              customers: 8,
              totalProducts: 49,
              stockProducts: 44,
              outOfStock: 5,
            },
            {
              date: "2025-01-05",
              orders: 15,
              revenue: 3400,
              customers: 8,
              totalProducts: 49,
              stockProducts: 44,
              outOfStock: 5,
            },
            {
              date: "2025-01-06",
              orders: 18,
              revenue: 4000,
              customers: 9,
              totalProducts: 50,
              stockProducts: 45,
              outOfStock: 5,
            },
            {
              date: "2025-01-07",
              orders: 20,
              revenue: 4500,
              customers: 10,
              totalProducts: 50,
              stockProducts: 45,
              outOfStock: 5,
            },
            {
              date: "2025-01-08",
              orders: 22,
              revenue: 5000,
              customers: 11,
              totalProducts: 50,
              stockProducts: 45,
              outOfStock: 5,
            },
          ],
        },
        customerOverview: {
          thisWeek: [
            {
              date: "2025-01-09",
              activeCustomers: 120,
              repeatCustomers: 45,
              shopVisitor: 890,
              conversionRate: 13.5,
            },
            {
              date: "2025-01-10",
              activeCustomers: 135,
              repeatCustomers: 52,
              shopVisitor: 920,
              conversionRate: 14.7,
            },
            {
              date: "2025-01-11",
              activeCustomers: 142,
              repeatCustomers: 58,
              shopVisitor: 980,
              conversionRate: 14.5,
            },
            {
              date: "2025-01-12",
              activeCustomers: 138,
              repeatCustomers: 55,
              shopVisitor: 950,
              conversionRate: 14.5,
            },
            {
              date: "2025-01-13",
              activeCustomers: 150,
              repeatCustomers: 62,
              shopVisitor: 1020,
              conversionRate: 14.7,
            },
            {
              date: "2025-01-14",
              activeCustomers: 165,
              repeatCustomers: 68,
              shopVisitor: 1100,
              conversionRate: 15.0,
            },
            {
              date: "2025-01-15",
              activeCustomers: 180,
              repeatCustomers: 75,
              shopVisitor: 1200,
              conversionRate: 15.0,
            },
          ],
          lastWeek: [
            {
              date: "2025-01-02",
              activeCustomers: 100,
              repeatCustomers: 35,
              shopVisitor: 750,
              conversionRate: 13.3,
            },
            {
              date: "2025-01-03",
              activeCustomers: 105,
              repeatCustomers: 38,
              shopVisitor: 780,
              conversionRate: 13.5,
            },
            {
              date: "2025-01-04",
              activeCustomers: 110,
              repeatCustomers: 40,
              shopVisitor: 820,
              conversionRate: 13.4,
            },
            {
              date: "2025-01-05",
              activeCustomers: 108,
              repeatCustomers: 42,
              shopVisitor: 800,
              conversionRate: 13.5,
            },
            {
              date: "2025-01-06",
              activeCustomers: 115,
              repeatCustomers: 45,
              shopVisitor: 850,
              conversionRate: 13.5,
            },
            {
              date: "2025-01-07",
              activeCustomers: 118,
              repeatCustomers: 48,
              shopVisitor: 880,
              conversionRate: 13.4,
            },
            {
              date: "2025-01-08",
              activeCustomers: 120,
              repeatCustomers: 50,
              shopVisitor: 900,
              conversionRate: 13.3,
            },
          ],
        },
      },
    },
  }).as("detailedDailyMetrics");

  cy.intercept("GET", `${api}/analytics/real-time*`, {
    statusCode: 200,
    body: {
      success: true,
      message: "ok",
      data: {
        activeUsers: 42,
        currentOrders: 5,
        todayRevenue: 2500,
      },
    },
  }).as("realTimeAnalytics");

  cy.intercept("GET", `${api}/analytics*`, {
    statusCode: 200,
    body: { success: true, message: "ok", data: {} },
  }).as("analytics");
}

function stubFormSubmissions() {
  cy.intercept("POST", `${api}/products`, {
    statusCode: 201,
    body: {
      success: true,
      message: "Product created successfully",
      data: { id: "new-product-1" },
    },
  }).as("createProduct");

  cy.intercept("POST", `${api}/categories`, {
    statusCode: 201,
    body: {
      success: true,
      message: "Category created successfully",
      data: { id: "new-category-1" },
    },
  }).as("createCategory");

  cy.intercept("POST", `${api}/coupons`, {
    statusCode: 201,
    body: {
      success: true,
      message: "Coupon created successfully",
      data: { id: "new-coupon-1" },
    },
  }).as("createCoupon");

  cy.intercept("POST", `${api}/customers`, {
    statusCode: 201,
    body: {
      success: true,
      message: "Customer created successfully",
      data: { id: "new-customer-1" },
    },
  }).as("createCustomer");
}

describe("Dashboard Full E2E Test Suite", () => {
  beforeEach(() => {
    stubAuth();
    stubCoreData();
    stubFormSubmissions();
  });

  it("Dashboard Home - Full View", () => {
    cy.visit("/dashboard");
    cy.url().should("include", "/dashboard");
    cy.wait(2000);
    cy.log("✅ Dashboard Home loaded - This Week view");

    // Switch to Last Week tab
    cy.contains("Last week").click();
    cy.log("✅ Switched to Last Week tab");
    cy.wait(1500);

    // Switch back to This Week tab
    cy.contains("This week").click();
    cy.log("✅ Switched to This Week tab");
    cy.wait(1500);

    // Scroll through dashboard
    cy.scrollTo(0, 400, { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo(0, 800, { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo("bottom", { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo("top", { ensureScrollable: false });
    cy.wait(1000);

    cy.log("🎉 Dashboard Home view completed!");
  });

  it("Customers Page - Full View", () => {
    cy.visit("/dashboard/customers");
    cy.contains("h1", "Customers").should("be.visible");
    cy.wait("@customers");
    cy.log("✅ Customers page loaded");
    cy.wait(2000);

    // Scroll through page
    cy.scrollTo(0, 400, { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo("bottom", { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo("top", { ensureScrollable: false });
    cy.wait(1000);

    cy.log("🎉 Customers page view completed!");
  });

  it("Coupons Page - Full View with Tab Switching", () => {
    cy.visit("/dashboard/coupons");
    cy.contains("h1", "Coupons").should("be.visible");
    cy.wait("@coupons");
    cy.contains("SUMMER25").should("be.visible");
    cy.log("✅ Coupons page loaded - All Coupons tab");
    cy.wait(1500);

    // Scroll to show full page
    cy.scrollTo(0, 300, { ensureScrollable: false });
    cy.wait(1000);
    cy.scrollTo("top", { ensureScrollable: false });
    cy.wait(500);

    // Switch to Active Coupons tab
    cy.contains('[role="tab"]', "Active").click();
    cy.log("✅ Switched to Active Coupons tab");
    cy.wait(1500);

    // Switch to Expired Coupons tab
    cy.contains('[role="tab"]', "Expired").click();
    cy.log("✅ Switched to Expired Coupons tab");
    cy.wait(1500);

    // Back to All Coupons tab
    cy.contains('[role="tab"]', "All").click();
    cy.log("✅ Back to All Coupons tab");
    cy.wait(1500);

    cy.log("🎉 Coupons page with tab switching completed!");
  });

  it("Categories Page - Full View", () => {
    cy.visit("/dashboard/categories");
    cy.contains("h1", "Categories").should("be.visible");
    cy.wait("@categories");
    cy.contains("Electronics").should("be.visible");
    cy.contains("Clothing").should("be.visible");
    cy.log("✅ Categories page loaded");
    cy.wait(2000);

    // Scroll through page
    cy.scrollTo(0, 400, { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo("bottom", { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo("top", { ensureScrollable: false });
    cy.wait(1000);

    cy.log("🎉 Categories page view completed!");
  });

  it("Products Page - Full View", () => {
    cy.visit("/dashboard/products");
    cy.contains("h1", "Product List").should("be.visible");
    cy.wait("@products");
    cy.contains("iPhone 15 Pro").should("be.visible");
    cy.contains("Samsung Galaxy S24").should("be.visible");
    cy.log("✅ Products page loaded");
    cy.wait(2000);

    // Scroll through page
    cy.scrollTo(0, 400, { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo("bottom", { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo("top", { ensureScrollable: false });
    cy.wait(1000);

    cy.log("🎉 Products page view completed!");
  });

  it("Orders Page - Full View with Tab Switching", () => {
    cy.visit("/dashboard/orders");
    cy.wait("@orders");
    cy.contains('[role="tab"]', "All").should("be.visible");
    cy.log("✅ Orders page loaded - All Orders tab");
    cy.wait(1500);

    // Scroll to show full page
    cy.scrollTo(0, 300, { ensureScrollable: false });
    cy.wait(1000);
    cy.scrollTo("top", { ensureScrollable: false });
    cy.wait(500);

    // Switch to Completed tab
    cy.contains('[role="tab"]', "Completed").click();
    cy.log("✅ Switched to Completed Orders tab");
    cy.wait(1500);

    // Switch to Pending tab
    cy.contains('[role="tab"]', "Pending").click();
    cy.log("✅ Switched to Pending Orders tab");
    cy.wait(1500);

    // Switch to Canceled tab
    cy.contains('[role="tab"]', "Canceled").click();
    cy.log("✅ Switched to Canceled Orders tab");
    cy.wait(1500);

    // Back to All Orders tab
    cy.contains('[role="tab"]', "All").click();
    cy.log("✅ Back to All Orders tab");
    cy.wait(1500);

    cy.log("🎉 Orders page with tab switching completed!");
  });

  it("Reports Page - Full View (No Tab Switching)", () => {
    cy.visit("/dashboard/reports");
    cy.contains("h1", "Reports").should("be.visible");
    cy.wait("@reports");
    cy.log("✅ Reports page loaded");
    cy.wait(2000);

    // Verify key metrics are displayed
    cy.contains("2,840").should("be.visible"); // New Users
    cy.contains("1,520").should("be.visible"); // Returning Users
    cy.log("✅ Key metrics displayed");
    cy.wait(1500);

    // Scroll through the entire page to show all charts
    cy.scrollTo(0, 400, { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo(0, 800, { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo(0, 1200, { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo("bottom", { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo("top", { ensureScrollable: false });
    cy.wait(1000);

    cy.log("🎉 Reports page full view completed!");
  });

  it("Transactions Page - View", () => {
    cy.visit("/dashboard/transactions");
    cy.wait("@transactions");
    cy.url().should("include", "/dashboard/transactions");
    cy.log("✅ Transactions page loaded");
    cy.wait(2500);

    cy.log("🎉 Transactions page view completed!");
  });

  it("Admin Page - Full View", () => {
    cy.visit("/dashboard/admin");
    cy.contains("h1", "About section").should("be.visible");
    cy.log("✅ Admin page loaded");
    cy.wait(2000);

    // Scroll through page
    cy.scrollTo(0, 400, { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo("bottom", { ensureScrollable: false });
    cy.wait(1500);
    cy.scrollTo("top", { ensureScrollable: false });
    cy.wait(1000);

    cy.log("🎉 Admin page view completed!");
  });

  it("Add Customer Form", () => {
    cy.visit("/dashboard/customers/add");
    cy.wait(500);

    cy.get("input#firstName").type("John", { delay: 30 });
    cy.get("input#lastName").type("Doe", { delay: 30 });
    cy.get("input#email").type("john.doe@example.com", { delay: 20 });
    cy.get("input#phone").type("+1234567890", { delay: 30 });
    cy.get("input#address").type("123 Main Street", { delay: 20 });
    cy.get("input#city").type("New York", { delay: 30 });
    cy.get("#country").click({ force: true });
    cy.wait(300);
    cy.contains('[role="option"]', "United States").click({ force: true });
    cy.get("input#postalCode").type("10001", { delay: 30 });
    cy.get("textarea#notes").type("VIP customer", { delay: 20 });

    cy.log("✅ Customer form completed");
    cy.wait(1000);
  });

  it("Add Coupon Form", () => {
    cy.visit("/dashboard/coupons/add");
    cy.wait(500);

    cy.get('input[placeholder="Shipfree20"]').type("HOLIDAY50", { delay: 30 });
    cy.get('input[placeholder="Free Shipping"]').type("Holiday Discount", {
      delay: 20,
    });
    cy.contains("button", "Percentage").click();
    cy.wait(300);
    cy.get('input[placeholder="Amount"]').type("25", { delay: 50 });
    cy.get('input[placeholder="e.g. 7"]').type("30", { delay: 50 });
    cy.get('input[placeholder="Amount of uses"]').type("500", { delay: 50 });

    cy.log("✅ Coupon form completed");
    cy.wait(1000);
  });

  it("Add Category Form", () => {
    cy.visit("/dashboard/categories/add");
    cy.wait(500);

    cy.get('input[placeholder="Women Clothes"]').type("Electronics & Gadgets", {
      delay: 20,
    });

    cy.log("✅ Category form completed");
    cy.wait(1000);
  });

  it("Add Product Form", () => {
    cy.visit("/dashboard/products/add");
    cy.contains("h1", "Add New Product").should("be.visible");
    cy.wait(500);

    cy.get('input[placeholder="iPhone 15"]').type("Premium Headphones", {
      delay: 20,
    });
    cy.get(
      'textarea[placeholder="The iPhone 15 delivers cutting-edge performance..."]'
    ).type("High-quality wireless headphones with noise cancellation.", {
      delay: 10,
    });
    cy.get('input[placeholder="$999.89"]').type("299.99", { delay: 30 });
    cy.get('input[placeholder="99"]').type("249", { delay: 30 });
    cy.get('input[placeholder="0"]').first().type("150", { delay: 30 });

    cy.log("✅ Product form completed");
    cy.wait(1000);
  });
});
