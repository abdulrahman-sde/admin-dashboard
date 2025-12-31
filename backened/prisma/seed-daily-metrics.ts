import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getDateDaysAgo = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(0, 0, 0, 0);
  return d;
};

async function run() {
  try {
    console.log("Seeding 14 days of DailyMetrics (non-destructive)...");

    const totalCustomers = await prisma.customer.count();
    const totalProducts = await prisma.product.count();
    const inStockProducts = await prisma.product.count({
      where: { stockQuantity: { gt: 0 } },
    });
    const outOfStockProducts = await prisma.product.count({
      where: { stockQuantity: { lte: 0 } },
    });

    for (let day = 0; day <= 13; day++) {
      const date = getDateDaysAgo(day);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayOrders = await prisma.order.findMany({
        where: { createdAt: { gte: date, lt: nextDay } },
      });
      const totalSales = dayOrders.reduce((s, o) => s + o.totalAmount, 0);

      const dayTransactions = await prisma.transaction.groupBy({
        by: ["paymentStatus"],
        _count: { id: true },
        where: { createdAt: { gte: date, lt: nextDay } },
      });
      const completedTransactions =
        dayTransactions.find((t) => t.paymentStatus === "COMPLETED")?._count
          .id ?? 0;

      // Improved traffic model: weekday seasonality, gentle trend toward recent days,
      // random noise and occasional spikes to create realistic fluctuations.
      const dow = date.getDay(); // 0 = Sun ... 6 = Sat

      const baseVisits = 1500;
      const trend = Math.round((13 - day) * 12); // small trend scaling towards recent days

      // Weekday multipliers (higher mid-week, lower weekends)
      const weekdayMultiplierMap: Record<number, number> = {
        0: 0.8,
        1: 0.95,
        2: 1.15,
        3: 1.05,
        4: 1.2,
        5: 1.0,
        6: 0.9,
      };
      const weekdayMultiplier = weekdayMultiplierMap[dow] ?? 1;

      // Noise and occasional promotional spike
      const noise = Math.round((Math.random() - 0.5) * 420);
      const spike =
        Math.random() < 0.12 ? Math.round(400 + Math.random() * 1500) : 0;

      const totalVisits = Math.max(
        40,
        Math.round((baseVisits + trend) * weekdayMultiplier + noise + spike)
      );
      const uniqueVisits = Math.max(
        20,
        Math.round(totalVisits * (0.55 + Math.random() * 0.3))
      );
      const totalPageViews = Math.max(
        totalVisits,
        Math.round(totalVisits * (1.8 + Math.random() * 2.2))
      );

      // Funnel rates vary by day and spike
      const baseCartRate = 0.1 + (weekdayMultiplier - 1) * 0.03;
      const cartRateFraction = Math.min(
        0.45,
        Math.max(
          0.03,
          baseCartRate + (Math.random() - 0.5) * 0.06 + (spike ? 0.05 : 0)
        )
      );
      const addToCartCount = Math.round(totalVisits * cartRateFraction);

      const checkoutFraction = Math.min(
        0.9,
        Math.max(0.12, 0.28 + (Math.random() - 0.5) * 0.26 + (spike ? 0.05 : 0))
      );
      const checkoutStartedCount = Math.round(
        addToCartCount * checkoutFraction
      );

      // Tie conversions to actual orders but allow small randomness
      const convertedSessions = Math.max(
        0,
        dayOrders.length + Math.round((Math.random() - 0.45) * 3)
      );

      const conversionRate =
        totalVisits > 0 ? (convertedSessions / totalVisits) * 100 : 0;
      const cartRate =
        totalVisits > 0 ? (addToCartCount / totalVisits) * 100 : 0;
      const checkoutRate =
        totalVisits > 0 ? (checkoutStartedCount / totalVisits) * 100 : 0;
      const purchaseRate = conversionRate;

      // upsert by date to avoid duplicates
      await prisma.dailyMetrics.upsert({
        where: { date },
        update: {
          totalOrders: dayOrders.length,
          totalSales,
          completedOrders: dayOrders.filter(
            (o) => o.fulfillmentStatus === "DELIVERED"
          ).length,
          newOrders: dayOrders.length,
          averageOrderValue:
            dayOrders.length > 0 ? totalSales / dayOrders.length : 0,
          totalCustomers,
          totalProducts,
          inStockProducts,
          outOfStockProducts,
          totalVisits,
          uniqueVisits,
          totalPageViews,
          cartRate,
          checkoutRate,
          purchaseRate,
          conversionRate,
          completedTransactions,
        },
        create: {
          date,
          totalOrders: dayOrders.length,
          totalSales,
          completedOrders: dayOrders.filter(
            (o) => o.fulfillmentStatus === "DELIVERED"
          ).length,
          cancelledOrders: 0,
          pendingOrders: 0,
          processingOrders: 0,
          shippedOrders: 0,
          newOrders: dayOrders.length,
          averageOrderValue:
            dayOrders.length > 0 ? totalSales / dayOrders.length : 0,
          totalCustomers,
          newCustomers: 0,
          returningCustomers: 0,
          totalProducts,
          inStockProducts,
          outOfStockProducts,
          totalVisits,
          uniqueVisits,
          totalPageViews,
          cartRate,
          checkoutRate,
          purchaseRate,
          conversionRate,
          completedTransactions,
          pendingTransactions: 0,
          failedTransactions: 0,
        },
      });
      console.log(`Upserted metrics for ${date.toISOString().split("T")[0]}`);
    }

    console.log("Done seeding daily metrics.");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
