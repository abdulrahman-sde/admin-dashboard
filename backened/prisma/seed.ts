import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const getImg = (id: string) =>
  `https://images.unsplash.com/${id}?w=300&h=300&q=40&fm=webp`;

const PRODUCT_IMAGES = {
  electronics: [
    getImg("photo-1505740420928-5e560c06d30e"),
    getImg("photo-1546868871-7041f2a55e12"),
    getImg("photo-1523275335684-37898b6baf30"),
  ],
  fashion: [
    getImg("photo-1521572163474-6864f9cf17ab"),
    getImg("photo-1556821840-3a63f95609a7"),
    getImg("photo-1542291026-7eec264c27ff"),
  ],
  home: [
    getImg("photo-1556911220-e15b29be8c8f"),
    getImg("photo-1616486338812-3dadae4b4ace"),
    getImg("photo-1615529328331-f8917597711f"),
  ],
};

const AVATARS = [
  "https://i.pravatar.cc/150?u=1",
  "https://i.pravatar.cc/150?u=2",
  "https://i.pravatar.cc/150?u=3",
  "https://i.pravatar.cc/150?u=4",
  "https://i.pravatar.cc/150?u=5",
];

const getDateDaysAgo = (daysAgo: number, hour: number = 12) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, 0, 0, 0);
  return date;
};

async function main() {
  console.log("🗑️ PERMANENTLY DELETING ALL DATA...");

  // Delete in proper order (foreign key constraints)
  await prisma.sessionEvent.deleteMany();
  await prisma.session.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.storePaymentMethod.deleteMany();
  await prisma.dailyMetrics.deleteMany();
  await prisma.realtimeMetrics.deleteMany();
  await prisma.coupon.deleteMany();

  console.log("✅ All data permanently deleted!");

  // ============================================
  // 1. PAYMENT METHOD
  // ============================================
  console.log("💳 Creating Payment Method...");
  const paymentMethod = await prisma.storePaymentMethod.create({
    data: {
      name: "Main Business Account",
      type: "BANK_TRANSFER",
      provider: "Global Bank",
      last4: "9876",
      holderName: "Admin Dashboard LLC",
      isDefault: true,
      status: "ACTIVE",
    },
  });

  // ============================================
  // 2. CUSTOMERS (Created 30 days ago)
  // ============================================
  console.log("👥 Creating 10 Customers...");
  const hashedPassword = await bcrypt.hash("customer123", 10);
  const customerData = [
    {
      firstName: "James",
      lastName: "Wilson",
      email: "james@example.com",
      isGuest: false,
      status: "VIP" as const,
    },
    {
      firstName: "Sarah",
      lastName: "Connor",
      email: "sarah@example.com",
      isGuest: false,
      status: "VIP" as const,
    },
    {
      firstName: "Robert",
      lastName: "Drake",
      email: "robert@example.com",
      isGuest: false,
      status: "ACTIVE" as const,
    },
    {
      firstName: "Emma",
      lastName: "Stone",
      email: "emma@example.com",
      isGuest: false,
      status: "ACTIVE" as const,
    },
    {
      firstName: "Mark",
      lastName: "Sloan",
      email: "mark@example.com",
      isGuest: false,
      status: "ACTIVE" as const,
    },
    {
      firstName: "Lucy",
      lastName: "Grey",
      email: "lucy@example.com",
      isGuest: false,
      status: "ACTIVE" as const,
    },
    {
      firstName: "Guest",
      lastName: "One",
      email: "guest1@example.com",
      isGuest: true,
      status: "ACTIVE" as const,
    },
    {
      firstName: "Guest",
      lastName: "Two",
      email: "guest2@example.com",
      isGuest: true,
      status: "ACTIVE" as const,
    },
    {
      firstName: "Guest",
      lastName: "Three",
      email: "guest3@example.com",
      isGuest: true,
      status: "ACTIVE" as const,
    },
    {
      firstName: "Guest",
      lastName: "Four",
      email: "guest4@example.com",
      isGuest: true,
      status: "ACTIVE" as const,
    },
  ];

  const customers = [];
  for (let i = 0; i < customerData.length; i++) {
    const c = customerData[i];
    const customer = await prisma.customer.create({
      data: {
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        password: c.isGuest ? null : hashedPassword,
        phone: `+1555${1000000 + i}`,
        role: c.isGuest ? "GUEST" : "CUSTOMER",
        isGuest: c.isGuest,
        status: c.status,
        avatar: AVATARS[i % AVATARS.length],
        createdAt: getDateDaysAgo(30),
        address: {
          street: `${123 + i} Main St`,
          city: "New York",
          country: "USA",
          postalCode: "10001",
          phone: `+1555${1000000 + i}`,
          isDefault: true,
        },
        deletedAt: null,
      },
    });
    customers.push(customer);
  }
  console.log(`   Created ${customers.length} customers`);

  // ============================================
  // 3. CATEGORIES
  // ============================================
  console.log("📁 Creating Categories...");
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electronics",
        slug: "electronics",
        image: PRODUCT_IMAGES.electronics[0],
        visibility: true,
        createdAt: getDateDaysAgo(30),
        deletedAt: null,
      },
    }),
    prisma.category.create({
      data: {
        name: "Fashion",
        slug: "fashion",
        image: PRODUCT_IMAGES.fashion[0],
        visibility: true,
        createdAt: getDateDaysAgo(30),
        deletedAt: null,
      },
    }),
    prisma.category.create({
      data: {
        name: "Home",
        slug: "home",
        image: PRODUCT_IMAGES.home[0],
        visibility: true,
        createdAt: getDateDaysAgo(30),
        deletedAt: null,
      },
    }),
  ]);
  console.log(`   Created ${categories.length} categories`);

  // ============================================
  // 4. PRODUCTS (5 in stock, 1 out of stock)
  // ============================================
  console.log("📦 Creating Products...");
  const productData = [
    {
      name: "Pro Headphones",
      sku: "H-001",
      price: 199.99,
      catIdx: 0,
      imgs: PRODUCT_IMAGES.electronics,
      isFeatured: true,
      stock: 50,
    },
    {
      name: "Smart Watch",
      sku: "W-001",
      price: 299.99,
      catIdx: 0,
      imgs: PRODUCT_IMAGES.electronics,
      isFeatured: true,
      stock: 30,
    },
    {
      name: "Cotton Tee",
      sku: "T-001",
      price: 25.0,
      catIdx: 1,
      imgs: PRODUCT_IMAGES.fashion,
      isFeatured: false,
      stock: 100,
    },
    {
      name: "Denim Jacket",
      sku: "J-001",
      price: 85.0,
      catIdx: 1,
      imgs: PRODUCT_IMAGES.fashion,
      isFeatured: false,
      stock: 0,
    },
    {
      name: "Ceramic Vase",
      sku: "V-001",
      price: 45.0,
      catIdx: 2,
      imgs: PRODUCT_IMAGES.home,
      isFeatured: false,
      stock: 25,
    },
    {
      name: "Soft Blanket",
      sku: "B-001",
      price: 60.0,
      catIdx: 2,
      imgs: PRODUCT_IMAGES.home,
      isFeatured: false,
      stock: 40,
    },
  ];

  const products = [];
  for (const p of productData) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.name.toLowerCase().replace(/ /g, "-"),
        sku: p.sku,
        description: `High quality ${p.name}`,
        price: p.price,
        stockQuantity: p.stock,
        categoryId: categories[p.catIdx].id,
        images: p.imgs,
        status: "ACTIVE",
        isFeatured: p.isFeatured,
        createdAt: getDateDaysAgo(25),
        deletedAt: null,
      },
    });
    products.push(product);
  }
  console.log(`   Created ${products.length} products`);

  // ============================================
  // 5. ORDERS & TRANSACTIONS (Spread over 14 days)
  // ============================================
  console.log("🛒 Creating Orders & Transactions...");
  const orderSchedule = [
    { day: 0, count: 3 },
    { day: 1, count: 2 },
    { day: 2, count: 2 },
    { day: 3, count: 2 },
    { day: 4, count: 2 },
    { day: 5, count: 2 },
    { day: 6, count: 2 },
    { day: 7, count: 2 },
    { day: 8, count: 1 },
    { day: 9, count: 2 },
    { day: 10, count: 1 },
    { day: 11, count: 2 },
    { day: 12, count: 1 },
    { day: 13, count: 1 },
  ];

  let orderNumber = 2025001;
  for (const schedule of orderSchedule) {
    for (let i = 0; i < schedule.count; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = 1 + Math.floor(Math.random() * 2);
      const subtotal = product.price * quantity;
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      const orderDate = getDateDaysAgo(schedule.day, 10 + i);

      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${orderNumber++}`,
          customerId: customer.id,
          subtotal,
          taxAmount: tax,
          shippingFee: 0,
          totalAmount: total,
          fulfillmentStatus: "DELIVERED",
          paymentStatus: "COMPLETED",
          paymentMethod: "CREDIT_CARD",
          createdAt: orderDate,
          items: {
            create: {
              productId: product.id,
              productName: product.name,
              productSku: product.sku,
              productImage: product.images[0],
              quantity,
              unitPrice: product.price,
              totalPrice: subtotal,
              createdAt: orderDate,
            },
          },
          deletedAt: null,
        },
      });

      await prisma.transaction.create({
        data: {
          transactionNumber: `TXN-${order.orderNumber.replace("ORD-", "")}`,
          orderId: order.id,
          customerId: customer.id,
          amount: total,
          paymentStatus: "COMPLETED",
          paymentMethod: "CREDIT_CARD",
          storePaymentMethodId: paymentMethod.id,
          createdAt: orderDate,
        },
      });
    }
  }
  console.log(
    `   Created ${await prisma.order.count()} orders with transactions`
  );

  // ============================================
  // 6. UPDATE CUSTOMER TOTALS
  // ============================================
  console.log("📊 Updating Customer Totals...");
  for (const c of await prisma.customer.findMany({
    include: { orders: true },
  })) {
    const totalSpent = c.orders.reduce((sum, o) => sum + o.totalAmount, 0);
    await prisma.customer.update({
      where: { id: c.id },
      data: {
        totalOrders: c.orders.length,
        totalSpent,
        averageOrderValue:
          c.orders.length > 0 ? totalSpent / c.orders.length : 0,
        lastOrderDate:
          c.orders.length > 0 ? c.orders[c.orders.length - 1].createdAt : null,
      },
    });
  }

  // ============================================
  // 7. UPDATE PRODUCT TOTALS
  // ============================================
  console.log("📊 Updating Product Totals...");
  for (const p of await prisma.product.findMany({
    include: { orderItems: true },
  })) {
    const totalSales = p.orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalRevenue = p.orderItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    await prisma.product.update({
      where: { id: p.id },
      data: { totalSales, totalRevenue },
    });
  }

  // ============================================
  // 8. CREATE DAILY METRICS (14 days of actual data)
  // ============================================
  console.log("📈 Creating Daily Metrics...");
  const totalCustomers = await prisma.customer.count();
  const totalProducts = await prisma.product.count();
  const inStockProducts = await prisma.product.count({
    where: { stockQuantity: { gt: 0 } },
  });
  const outOfStockProducts = await prisma.product.count({
    where: { stockQuantity: { lte: 0 } },
  });

  for (let day = 0; day <= 13; day++) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get orders for this day
    const dayOrders = await prisma.order.findMany({
      where: { createdAt: { gte: date, lt: nextDay } },
    });
    const totalSales = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const completedOrders = dayOrders.filter(
      (o) => o.fulfillmentStatus === "DELIVERED"
    ).length;

    // Get transactions for this day
    const dayTransactions = await prisma.transaction.groupBy({
      by: ["paymentStatus"],
      _count: { id: true },
      where: { createdAt: { gte: date, lt: nextDay } },
    });
    const completedTransactions =
      dayTransactions.find((t) => t.paymentStatus === "COMPLETED")?._count.id ??
      0;

    await prisma.dailyMetrics.create({
      data: {
        date,
        totalOrders: dayOrders.length,
        totalSales,
        completedOrders,
        cancelledOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        newOrders: dayOrders.length,
        averageOrderValue:
          dayOrders.length > 0 ? totalSales / dayOrders.length : 0,
        totalCustomers,
        newCustomers: 0, // All created on day 30
        returningCustomers: 0,
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        totalVisits: 0,
        uniqueVisits: 0,
        totalPageViews: 0,
        conversionRate: 0,
        completedTransactions,
        pendingTransactions: 0,
        failedTransactions: 0,
      },
    });
  }
  console.log(
    `   Created ${await prisma.dailyMetrics.count()} daily metrics records`
  );

  // ============================================
  // SUMMARY
  // ============================================
  console.log("\n✨ SEEDING COMPLETED!");
  console.log(`   Customers: ${await prisma.customer.count()}`);
  console.log(`   Categories: ${await prisma.category.count()}`);
  console.log(
    `   Products: ${await prisma.product.count()} (${inStockProducts} in stock, ${outOfStockProducts} out)`
  );
  console.log(`   Orders: ${await prisma.order.count()}`);
  console.log(`   Transactions: ${await prisma.transaction.count()}`);
  console.log(`   Daily Metrics: ${await prisma.dailyMetrics.count()}`);
  console.log("\n📊 ALL DATA IS CONSISTENT!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
