import {
  PrismaClient,
  ProductStatus,
  PaymentStatus,
  PaymentGateway,
  SessionType,
  PaymentMethod,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting production-grade seed...");

  // Cleanup
  await prisma.dailyMetrics.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.session.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  //   await prisma.storePaymentMethod.deleteMany(); // Keep existing for now as user provided a specific ID

  // 1. Create Categories
  console.log("📁 Creating categories...");
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Men's Fashion", slug: "mens-fashion", deletedAt: null },
    }),
    prisma.category.create({
      data: {
        name: "Women's Fashion",
        slug: "womens-fashion",
        deletedAt: null,
      },
    }),
    prisma.category.create({
      data: { name: "Accessories", slug: "accessories", deletedAt: null },
    }),
    prisma.category.create({
      data: { name: "Electronics", slug: "electronics", deletedAt: null },
    }),
  ]);

  // 2. Create Products
  console.log("👕 Creating products...");
  const products = [];
  const productTemplates = [
    {
      name: "Men White T-Shirt",
      price: 29.99,
      cat: 0,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    },
    {
      name: "Women White T-Shirt",
      price: 25.0,
      cat: 1,
      image:
        "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80",
    },
    {
      name: "Women Striped T-Shirt",
      price: 34.5,
      cat: 1,
      image:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
    },
    {
      name: "Men Grey Hoodie",
      price: 55.0,
      cat: 0,
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    },
    {
      name: "Women Red T-Shirt",
      price: 28.0,
      cat: 1,
      image:
        "https://images.unsplash.com/photo-1583743814966-893003b41315?w=800&q=80",
    },
    {
      name: "Leather Wallet",
      price: 45.0,
      cat: 2,
      image:
        "https://images.unsplash.com/photo-1627123424574-18bd75a7298c?w=800&q=80",
    },
    {
      name: "Wireless Headphones",
      price: 129.99,
      cat: 3,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    },
    {
      name: "Smart Watch",
      price: 199.99,
      cat: 3,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    },
    {
      name: "Denim Jeans",
      price: 59.99,
      cat: 0,
      image:
        "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800&q=80",
    },
    {
      name: "Running Shoes",
      price: 89.99,
      cat: 2,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    },
  ];

  for (const t of productTemplates) {
    const p = await prisma.product.create({
      data: {
        name: t.name,
        slug:
          t.name.toLowerCase().replace(/ /g, "-") +
          "-" +
          faker.number.int(1000),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        price: t.price,
        discountPrice: t.price * 0.9,
        categoryId: categories[t.cat].id,
        status: ProductStatus.ACTIVE,
        stockQuantity: faker.number.int({ min: 10, max: 200 }),
        totalSales: faker.number.int({ min: 50, max: 500 }),
        viewCount: faker.number.int({ min: 500, max: 15000 }),
        thumbnail: t.image,
        description: faker.commerce.productDescription(),
        deletedAt: null,
      },
    });
    products.push(p);
  }

  // 3. Customers
  console.log("👥 Creating customers...");
  const customers = [];
  for (let i = 0; i < 100; i++) {
    const c = await prisma.customer.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$JcCD0MvM3Y7sSjZ+N3XyKg$8tV+fBZzQyXz7XyXz7XyXz7XyXz7XyXz7XyXz7XyXz",
        phone: faker.phone.number(),
        status: "ACTIVE",
        isGuest: false,
        totalOrders: 0,
        totalSpent: 0,
        deletedAt: null,
      },
    });
    customers.push(c);
  }

  // 4. Historical Metrics
  console.log("📊 Generating historical daily metrics...");
  const now = new Date();
  const daysToSeed = 90;
  let runningCustomerCount = 0;

  for (let i = 0; i < daysToSeed; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (daysToSeed - i));

    // Every day we "add" one of our seeded customers
    const customersToAdd = i < customers.length ? 1 : 0;
    runningCustomerCount += customersToAdd;

    const visits = Math.floor(100 + Math.random() * 50);
    const orders = Math.floor(visits * 0.04); // ~4% conv
    const sales = orders * 85;

    const deviceVisits = {
      mobile: Math.floor(visits * 0.6),
      desktop: Math.floor(visits * 0.3),
      tablet: visits - Math.floor(visits * 0.6) - Math.floor(visits * 0.3),
    };

    const countrySales = {
      "United States": Math.floor(sales * 0.4),
      Brazil: Math.floor(sales * 0.2),
      Australia: Math.floor(sales * 0.15),
      Canada: Math.floor(sales * 0.15),
      "United Kingdom":
        sales -
        Math.floor(sales * 0.4) -
        Math.floor(sales * 0.2) -
        Math.floor(sales * 0.15) -
        Math.floor(sales * 0.15),
    };

    await prisma.dailyMetrics.create({
      data: {
        date: date,
        totalSales: sales,
        totalOrders: orders,
        totalVisits: visits,
        uniqueVisits: Math.floor(visits * 0.8),
        newCustomers: customersToAdd,
        returningCustomers: Math.floor(orders * 0.5),
        averageOrderValue: 85,
        conversionRate: 4.2,
        cartRate: 30,
        checkoutRate: 15,
        purchaseRate: 4.2,
        salesByCountry: countrySales,
        visitsByDevice: deviceVisits,
        totalCustomers: runningCustomerCount,
        totalProducts: products.length,
        inStockProducts: products.length,
        outOfStockProducts: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: orders,
        cancelledOrders: 0,
        completedTransactions: orders,
        pendingTransactions: 0,
        failedTransactions: 0,
      },
    });
  }

  // 5. Recent Orders
  console.log("🛒 Creating recent orders...");
  for (let i = 0; i < 40; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const qty = 1;
    const total = product.price * qty;

    const countries = [
      "United States",
      "Brazil",
      "Australia",
      "Canada",
      "United Kingdom",
    ];
    const country = countries[Math.floor(Math.random() * countries.length)];

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${i}`,
        customerId: customer.id,
        subtotal: total,
        taxAmount: 0,
        shippingFee: 0,
        totalAmount: total,
        fulfillmentStatus: "DELIVERED",
        paymentStatus: PaymentStatus.COMPLETED,
        country: country,
        items: {
          create: [
            {
              productId: product.id,
              quantity: qty,
              unitPrice: product.price,
              totalPrice: total,
              productName: product.name,
              productSku: product.sku,
            },
          ],
        },
        createdAt: new Date(),
        deletedAt: null,
      },
    });

    const methodId = "695b816695e6b4cca4a4770c";

    // Transaction
    await prisma.transaction.create({
      data: {
        transactionNumber: `TXN-${Date.now()}-${i}`,
        amount: total,
        paymentStatus: PaymentStatus.COMPLETED,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        paymentGateway: PaymentGateway.STRIPE,
        customerId: customer.id,
        orderId: order.id,
        storePaymentMethodId: methodId,
      },
    });

    // Update stats
    await prisma.customer.update({
      where: { id: customer.id },
      data: { totalOrders: { increment: 1 }, totalSpent: { increment: total } },
    });
  }

  // 6. Sessions
  console.log("📱 Creating sessions...");
  for (let i = 0; i < 10; i++) {
    await prisma.session.create({
      data: {
        sessionId: faker.string.uuid(),
        ipAddress: faker.internet.ipv4(),
        userAgent: faker.internet.userAgent(),
        device: "mobile",
        lastSeenAt: new Date(),
      },
    });
  }

  // 7. Coupons
  console.log("🎟️ Creating coupons...");
  await prisma.coupon.create({
    data: {
      code: "WELCOME2025",
      name: "Welcome Discount",
      type: "PERCENTAGE",
      value: 10,
      startDate: new Date(),
      status: "ACTIVE",
      usageLimit: 100,
      usageCount: 12,
    },
  });

  console.log("✅ Seed completed clean.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
