import {
  PrismaClient,
  PaymentMethod,
  PaymentStatus,
  FulfillmentStatus,
  ProductStatus,
  PaymentGateway,
  CustomerStatus,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Configuration
const DAYS_TO_SIMULATE = 90;
const NUM_CUSTOMERS = 20;
const TOTAL_ORDERS_TARGET = 120;

// Categories with VERIFIED working Unsplash images
const CATEGORIES = [
  {
    name: "Electronics",
    description: "Latest gadgets and tech",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    slug: "electronics",
    products: [
      {
        name: "Wireless Headphones",
        price: 199.99,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      },
      {
        name: "Smart Watch",
        price: 149.5,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      },
      {
        name: "Mechanical Keyboard",
        price: 129.99,
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      },
      {
        name: "Gaming Mouse",
        price: 59.99,
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
      },
    ],
  },
  {
    name: "Fashion",
    description: "Trendy apparel and accessories",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
    slug: "fashion",
    products: [
      {
        name: "Denim Jacket",
        price: 89.99,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
      },
      {
        name: "Sneakers",
        price: 120.0,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      },
      {
        name: "Summer Dress",
        price: 65.5,
        image:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800",
      },
      {
        name: "Sunglasses",
        price: 150.0,
        image:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
      },
    ],
  },
  {
    name: "Home & Living",
    description: "Decor and furniture",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800",
    slug: "home-living",
    products: [
      {
        name: "Ceramic Vase",
        price: 45.0,
        image:
          "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800",
      },
      {
        name: "Desk Lamp",
        price: 60.0,
        image:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
      },
      {
        name: "Area Rug",
        price: 150.0,
        image:
          "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800",
      },
    ],
  },
  {
    name: "Sports",
    description: "Active gear and equipment",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    slug: "sports",
    products: [
      {
        name: "Yoga Mat",
        price: 40.0,
        image:
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
      },
      {
        name: "Water Bottle",
        price: 25.0,
        image:
          "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800",
      },
      {
        name: "Running Shoes",
        price: 110.0,
        image:
          "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",
      },
    ],
  },
  {
    name: "Beauty",
    description: "Self care products",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
    slug: "beauty",
    products: [
      {
        name: "Face Cream",
        price: 45.0,
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
      },
      {
        name: "Organic Soap",
        price: 12.0,
        image:
          "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800",
      },
      {
        name: "Hair Oil",
        price: 28.0,
        image:
          "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800",
      },
    ],
  },
];

// Full country names for proper frontend recognition
const COUNTRIES = [
  "United States",
  "Germany",
  "United Kingdom",
  "France",
  "Australia",
  "Canada",
  "Brazil",
  "Japan",
];

const DEVICES = ["mobile", "desktop", "tablet", "mobile", "desktop"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("🚀 Starting comprehensive seed...");

  // Setup payment method
  console.log("💳 Creating payment method...");
  const paymentMethod = await prisma.storePaymentMethod.create({
    data: {
      name: "Stripe",
      type: PaymentMethod.CREDIT_CARD,
      provider: "Stripe",
      last4: "4242",
      holderName: "Admin",
      isDefault: true,
    },
  });

  // Create categories and products
  console.log("📦 Creating categories and products...");
  const allProducts: any[] = [];

  for (const cat of CATEGORIES) {
    const dbCat = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        visibility: true,
        deletedAt: null,
      },
    });

    for (const p of cat.products) {
      const product = await prisma.product.create({
        data: {
          name: p.name,
          slug: faker.helpers.slugify(
            p.name + "-" + faker.string.alphanumeric(4)
          ),
          sku: faker.string.alphanumeric(8).toUpperCase(),
          description: faker.commerce.productDescription(),
          price: p.price,
          costPrice: p.price * 0.6,
          stockQuantity: 100,
          status: ProductStatus.ACTIVE,
          categoryId: dbCat.id,
          thumbnail: p.image,
          images: [p.image],
          viewCount: randomInt(50, 500), // Pre-seed with some views
          deletedAt: null,
        },
      });
      allProducts.push({
        ...product,
        _stats: { sales: 0, revenue: 0, views: product.viewCount },
      });
    }
  }

  // Create customers with full country names
  console.log("👥 Creating 20 customers...");
  const customers: any[] = [];

  for (let i = 0; i < NUM_CUSTOMERS; i++) {
    const country = randomItem(COUNTRIES);
    const customer = await prisma.customer.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        avatar: faker.image.avatar(),
        status: CustomerStatus.ACTIVE,
        country: country,
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          country: country,
          postalCode: faker.location.zipCode(),
          state: faker.location.state(),
        },
        deletedAt: null,
      },
    });
    customers.push({
      ...customer,
      _stats: { orders: 0, spent: 0, lastOrder: null },
    });
  }

  // Simulate 90 days of traffic
  console.log("📅 Simulating 90 days of traffic...");
  const today = new Date();
  let totalOrdersCreated = 0;
  const probOrder = TOTAL_ORDERS_TARGET / DAYS_TO_SIMULATE;

  for (let d = DAYS_TO_SIMULATE; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    date.setUTCHours(12, 0, 0, 0);

    // Determine orders for today
    const r = Math.random();
    let ordersToday = 0;
    if (r < probOrder) ordersToday = 1;
    if (r < probOrder * 0.2) ordersToday = 2;
    if (r < probOrder * 0.05) ordersToday = 3;

    const visitsToday = ordersToday + randomInt(3, 8);
    let dailyRevenue = 0;
    let newCust = 0;
    let retCust = 0;
    const dailySalesByCountry: Record<string, number> = {};

    // Create sessions for device analytics
    for (let v = 0; v < visitsToday; v++) {
      await prisma.session.create({
        data: {
          sessionId: faker.string.uuid(),
          startedAt: date,
          lastSeenAt: new Date(date.getTime() + randomInt(1, 30) * 60000),
          device: randomItem(DEVICES),
          ipAddress: faker.internet.ipv4(),
          userAgent: faker.internet.userAgent(),
          customerId: null,
        },
      });
    }

    // Create orders and transactions
    for (let o = 0; o < ordersToday; o++) {
      const custIdx = randomInt(0, customers.length - 1);
      const customer = customers[custIdx];
      const isFirst = customer._stats.orders === 0;

      const prod = randomItem(allProducts);
      const qty = randomInt(1, 2);
      const total = prod.price * qty;
      const tax = total * 0.08;
      const grandTotal = total + tax;

      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${faker.string.alphanumeric(6).toUpperCase()}`,
          customerId: customer.id,
          subtotal: total,
          taxAmount: tax,
          shippingFee: 0,
          totalAmount: grandTotal,
          paymentStatus: PaymentStatus.COMPLETED,
          fulfillmentStatus: FulfillmentStatus.DELIVERED,
          paymentMethod: PaymentMethod.CREDIT_CARD,
          shippingAddress: customer.address,
          billingAddress: customer.address,
          country: customer.country,
          createdAt: date,
          updatedAt: date,
          deletedAt: null,
          ipAddress: faker.internet.ipv4(),
          userAgent: faker.internet.userAgent(),
          items: {
            create: [
              {
                productId: prod.id,
                productName: prod.name,
                productSku: prod.sku,
                productImage: prod.thumbnail,
                quantity: qty,
                unitPrice: prod.price,
                totalPrice: total,
              },
            ],
          },
        },
      });

      await prisma.transaction.create({
        data: {
          transactionNumber: `TXN-${faker.string
            .alphanumeric(8)
            .toUpperCase()}`,
          orderId: order.id,
          customerId: customer.id,
          amount: grandTotal,
          currency: "USD",
          paymentStatus: PaymentStatus.COMPLETED,
          paymentMethod: PaymentMethod.CREDIT_CARD,
          paymentGateway: PaymentGateway.STRIPE,
          storePaymentMethodId: paymentMethod.id,
          createdAt: date,
          updatedAt: date,
        },
      });

      customer._stats.orders++;
      customer._stats.spent += grandTotal;
      customer._stats.lastOrder = date;
      prod._stats.sales += qty;
      prod._stats.revenue += total;

      dailySalesByCountry[customer.country] =
        (dailySalesByCountry[customer.country] || 0) + grandTotal;
      dailyRevenue += grandTotal;
      if (isFirst) newCust++;
      else retCust++;
      totalOrdersCreated++;
    }

    // Build visits by device for this day
    const visitsByDevice: Record<string, number> = {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    };
    for (let k = 0; k < visitsToday; k++) {
      const device = randomItem(DEVICES);
      visitsByDevice[device] = (visitsByDevice[device] || 0) + 1;
    }

    // Create daily metrics
    const conversion = visitsToday > 0 ? (ordersToday / visitsToday) * 100 : 0;

    await prisma.dailyMetrics.create({
      data: {
        date: date,
        totalVisits: visitsToday,
        uniqueVisits: Math.ceil(visitsToday * 0.8),
        totalPageViews: visitsToday * randomInt(2, 4),
        conversionRate: conversion,
        totalSales: dailyRevenue,
        totalOrders: ordersToday,
        newOrders: ordersToday,
        completedOrders: ordersToday,
        completedTransactions: ordersToday,
        pendingTransactions: 0,
        failedTransactions: 0,
        returningCustomers: retCust,
        newCustomers: newCust,
        totalCustomers: customers.filter((c) => c._stats.orders > 0).length,
        totalProducts: allProducts.length,
        inStockProducts: allProducts.length,
        outOfStockProducts: 0,
        averageOrderValue: ordersToday > 0 ? dailyRevenue / ordersToday : 0,
        visitsByDevice: visitsByDevice,
        salesByCountry: dailySalesByCountry,
      },
    });
  }

  // Sync customer totals
  console.log("🔄 Syncing customer totals...");
  for (const c of customers) {
    if (c._stats.orders > 0) {
      await prisma.customer.update({
        where: { id: c.id },
        data: {
          totalOrders: c._stats.orders,
          totalSpent: c._stats.spent,
          averageOrderValue: c._stats.spent / c._stats.orders,
          lastOrderDate: c._stats.lastOrder,
        },
      });
    }
  }

  // Sync product totals
  console.log("🔄 Syncing product totals...");
  for (const p of allProducts) {
    await prisma.product.update({
      where: { id: p.id },
      data: {
        totalSales: p._stats.sales,
        totalRevenue: p._stats.revenue,
        stockQuantity: { decrement: p._stats.sales },
        viewCount: p._stats.views,
      },
    });
  }

  // Create monthly goal
  const currentMonth = today.toISOString().slice(0, 7);
  await prisma.monthlyGoal
    .create({
      data: {
        month: currentMonth,
        goalAmount: 15000,
        achievedAmount: 0,
      },
    })
    .catch(() => {});

  console.log(
    `✅ Done! Created ${totalOrdersCreated} orders, ${allProducts.length} products, ${customers.length} customers.`
  );
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
