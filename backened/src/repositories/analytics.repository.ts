import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type {
  RawOrderMetrics,
  RawProductMetrics,
  RawSessionMetrics,
} from "../types/job.types.js";

export const analyticsRepository = {
  // 1. Order Metrics
  async getOrderMetrics(startOfDay: Date, endOfDay: Date) {
    const rawOrderMetrics = (await prisma.order.aggregateRaw({
      pipeline: [
        {
          $match: {
            createdAt: {
              $gte: { $date: startOfDay.toISOString() },
              $lt: { $date: endOfDay.toISOString() },
            },
          },
        },
        // Join with customers to determine new vs returning stats
        {
          $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "customerInfo",
          },
        },
        { $unwind: "$customerInfo" },
        {
          $facet: {
            totalStats: [
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalSales: { $sum: "$totalAmount" },
                },
              },
            ],
            completedOrders: [
              { $match: { fulfillmentStatus: "DELIVERED" } },
              { $count: "count" },
            ],
            cancelledOrders: [
              { $match: { fulfillmentStatus: "CANCELED" } },
              { $count: "count" },
            ],
            pendingOrders: [
              { $match: { fulfillmentStatus: "PENDING" } },
              { $count: "count" },
            ],
            processingOrders: [
              { $match: { fulfillmentStatus: "PROCESSING" } },
              { $count: "count" },
            ],
            shippedOrders: [
              { $match: { fulfillmentStatus: "SHIPPED" } },
              { $count: "count" },
            ],
            // New Orders: Orders where customer was created today
            newOrders: [
              {
                $match: {
                  "customerInfo.createdAt": {
                    $gte: { $date: startOfDay.toISOString() },
                  },
                },
              },
              { $count: "count" },
            ],
            // Returning Customers: Distinct customers who ordered today but created before today
            returningCustomers: [
              {
                $match: {
                  "customerInfo.createdAt": {
                    $lt: { $date: startOfDay.toISOString() },
                  },
                },
              },
              { $group: { _id: "$customerId" } },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            totalOrders: { $arrayElemAt: ["$totalStats.totalOrders", 0] },
            totalSales: { $arrayElemAt: ["$totalStats.totalSales", 0] },
            completedOrders: { $arrayElemAt: ["$completedOrders.count", 0] },
            cancelledOrders: { $arrayElemAt: ["$cancelledOrders.count", 0] },
            pendingOrders: { $arrayElemAt: ["$pendingOrders.count", 0] },
            processingOrders: { $arrayElemAt: ["$processingOrders.count", 0] },
            shippedOrders: { $arrayElemAt: ["$shippedOrders.count", 0] },
            newOrders: { $arrayElemAt: ["$newOrders.count", 0] },
            returningCustomers: {
              $arrayElemAt: ["$returningCustomers.count", 0],
            },
          },
        },
      ],
    })) as unknown as RawOrderMetrics[];

    const metrics = rawOrderMetrics[0] || {};

    return {
      totalOrders: Number(metrics.totalOrders || 0),
      totalSales: Number(metrics.totalSales || 0),
      completedOrders: Number(metrics.completedOrders || 0),
      cancelledOrders: Number(metrics.cancelledOrders || 0),
      pendingOrders: Number(metrics.pendingOrders || 0),
      processingOrders: Number(metrics.processingOrders || 0),
      shippedOrders: Number(metrics.shippedOrders || 0),
      newOrders: Number(metrics.newOrders || 0),
      returningCustomers: Number(metrics.returningCustomers || 0),
    };
  },

  // 2. Product Metrics (Global Snapshot)
  async getProductMetrics() {
    // Single aggregation pipeline to compute counts in one round-trip for performance
    const result = (await prisma.product.aggregateRaw({
      pipeline: [
        { $match: { deletedAt: null } },
        {
          $facet: {
            total: [{ $count: "count" }],
            inStock: [
              { $match: { stockQuantity: { $gt: 0 } } },
              { $count: "count" },
            ],
            outOfStock: [
              { $match: { stockQuantity: { $lte: 0 } } },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            total: { $arrayElemAt: ["$total.count", 0] },
            inStock: { $arrayElemAt: ["$inStock.count", 0] },
            outOfStock: { $arrayElemAt: ["$outOfStock.count", 0] },
          },
        },
      ],
    })) as unknown as Array<{
      total?: number;
      inStock?: number;
      outOfStock?: number;
    }>;

    const r = result[0] || {};
    return {
      totalProducts: Number(r.total ?? 0),
      inStockProducts: Number(r.inStock ?? 0),
      outOfStockProducts: Number(r.outOfStock ?? 0),
    };
  },

  // 3. Customer Metrics
  async getNewCustomersCount(startOfDay: Date, endOfDay: Date) {
    return prisma.customer.count({
      where: {
        createdAt: { gte: startOfDay, lt: endOfDay },
        deletedAt: null,
      },
    });
  },

  async getTotalCustomersCount() {
    return prisma.customer.count({
      where: { deletedAt: null },
    });
  },

  // 4. Session Metrics
  async getSessionMetrics(startOfDay: Date, endOfDay: Date) {
    // Run aggregated queries in parallel for performance.
    const [
      rawSessionMetrics,
      totalPageViews,
      addToCartCount,
      checkoutStartedCount,
      convertedSessions,
    ] = await Promise.all([
      prisma.session.aggregateRaw({
        pipeline: [
          {
            $match: {
              startedAt: {
                $gte: { $date: startOfDay.toISOString() },
                $lt: { $date: endOfDay.toISOString() },
              },
            },
          },
          {
            $facet: {
              totalVisits: [{ $count: "count" }],
              uniqueVisits: [
                { $group: { _id: "$visitorId" } },
                { $count: "count" },
              ],
              convertedSessions: [
                { $match: { converted: true } },
                { $count: "count" },
              ],
            },
          },
          {
            $project: {
              totalVisits: { $arrayElemAt: ["$totalVisits.count", 0] },
              uniqueVisits: { $arrayElemAt: ["$uniqueVisits.count", 0] },
              convertedSessions: {
                $arrayElemAt: ["$convertedSessions.count", 0],
              },
            },
          },
        ],
      }),

      // page views, add_to_cart, checkout_started counts from session_events
      prisma.sessionEvent.count({
        where: {
          timestamp: { gte: startOfDay, lt: endOfDay },
          eventType: "page_view",
        },
      }),

      prisma.sessionEvent.count({
        where: {
          timestamp: { gte: startOfDay, lt: endOfDay },
          eventType: "add_to_cart",
        },
      }),

      prisma.sessionEvent.count({
        where: {
          timestamp: { gte: startOfDay, lt: endOfDay },
          eventType: "checkout_started",
        },
      }),

      // Converted sessions count (fallback if aggregateRaw didn't include it)
      prisma.session.count({
        where: {
          startedAt: { gte: startOfDay, lt: endOfDay },
          converted: true,
        },
      }),
    ]);

    const sessionStats =
      (rawSessionMetrics as unknown as RawSessionMetrics[])[0] || {};

    // Prefer convertedSessions from the sessions aggregate if present
    const converted = Number(
      sessionStats.convertedSessions ?? convertedSessions ?? 0
    );

    return {
      totalVisits: Number(sessionStats.totalVisits || 0),
      uniqueVisits: Number(sessionStats.uniqueVisits || 0),
      totalPageViews,
      addToCartCount: Number(addToCartCount),
      checkoutStartedCount: Number(checkoutStartedCount),
      convertedSessions: converted,
    };
  },

  async getProductViewMetrics(startOfDay: Date, endOfDay: Date) {
    return prisma.sessionEvent.groupBy({
      by: ["productId"],
      where: {
        eventType: "product_view",
        timestamp: { gte: startOfDay, lt: endOfDay },
        productId: { not: null },
      },
      _count: {
        id: true,
      },
    });
  },

  // 5. Transaction Metrics
  async getTransactionMetrics(startOfDay: Date, endOfDay: Date) {
    const metrics = await prisma.transaction.groupBy({
      by: ["paymentStatus"],
      _count: {
        id: true,
      },
      where: {
        createdAt: { gte: startOfDay, lt: endOfDay },
      },
    });

    const result = {
      completedTransactions: 0,
      pendingTransactions: 0,
      failedTransactions: 0,
    };

    metrics.forEach((m) => {
      if (m.paymentStatus === "COMPLETED")
        result.completedTransactions = m._count.id;
      if (m.paymentStatus === "PENDING")
        result.pendingTransactions = m._count.id;
      if (m.paymentStatus === "FAILED") result.failedTransactions = m._count.id;
    });

    return result;
  },

  // 6. Upsert daily metrics
  async upsertDailyMetrics(
    date: Date,
    data: Omit<Prisma.DailyMetricsCreateInput, "date">
  ) {
    return prisma.dailyMetrics.upsert({
      where: { date },
      update: data,
      create: {
        date,
        ...data,
      },
    });
  },

  // 7. Aggregate Stats for Dashboard
  async getWeeklyOrderStats({ from, to }: { from: Date; to: Date }) {
    const result = await prisma.dailyMetrics.aggregate({
      _sum: {
        totalOrders: true,
        totalSales: true,
        completedOrders: true,
        cancelledOrders: true,
        pendingOrders: true,
        processingOrders: true,
        shippedOrders: true,
        newOrders: true,
        averageOrderValue: true,
      },
      where: {
        date: { gte: from, lte: to },
      },
    });

    // If no daily metrics exist, query orders directly
    if (result._sum.totalOrders === null) {
      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: from, lte: to } },
      });

      const totalOrders = orders.length;
      const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const completedOrders = orders.filter(
        (o) => o.fulfillmentStatus === "DELIVERED"
      ).length;
      const cancelledOrders = orders.filter(
        (o) => o.fulfillmentStatus === "CANCELED"
      ).length;
      const pendingOrders = orders.filter(
        (o) => o.fulfillmentStatus === "PENDING"
      ).length;

      return {
        totalOrders,
        totalSales,
        completedOrders,
        cancelledOrders,
        pendingOrders,
        processingOrders: 0,
        shippedOrders: 0,
        newOrders: 0,
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
      };
    }

    return {
      totalOrders: result._sum.totalOrders ?? 0,
      totalSales: result._sum.totalSales ?? 0,
      completedOrders: result._sum.completedOrders ?? 0,
      cancelledOrders: result._sum.cancelledOrders ?? 0,
      pendingOrders: result._sum.pendingOrders ?? 0,
      processingOrders: result._sum.processingOrders ?? 0,
      shippedOrders: result._sum.shippedOrders ?? 0,
      newOrders: result._sum.newOrders ?? 0,
      averageOrderValue: result._sum.averageOrderValue ?? 0,
    };
  },

  async getWeeklyCustomerStats({ from, to }: { from: Date; to: Date }) {
    const aggregate = await prisma.dailyMetrics.aggregate({
      _sum: {
        newCustomers: true,
        returningCustomers: true,
        totalVisits: true,
      },
      where: {
        date: { gte: from, lte: to },
      },
    });

    // Get the latest record in this period for snapshot metrics like totalCustomers
    const latestMetric = await prisma.dailyMetrics.findFirst({
      where: { date: { gte: from, lte: to } },
      orderBy: { date: "desc" },
    });

    // If no daily metrics exist, get current customer counts directly
    if (!latestMetric) {
      const totalCustomers = await prisma.customer.count({
        where: { deletedAt: null },
      });
      const newCustomers = await prisma.customer.count({
        where: {
          deletedAt: null,
          createdAt: { gte: from, lte: to },
        },
      });

      return {
        newCustomers,
        returningCustomers: 0,
        totalVisits: 0,
        totalCustomers,
      };
    }

    return {
      newCustomers: aggregate._sum.newCustomers ?? 0,
      returningCustomers: aggregate._sum.returningCustomers ?? 0,
      totalVisits: aggregate._sum.totalVisits ?? 0,
      totalCustomers: latestMetric?.totalCustomers ?? 0,
    };
  },

  async getWeeklyTransactionStats({ from, to }: { from: Date; to: Date }) {
    const result = await prisma.dailyMetrics.aggregate({
      _sum: {
        completedTransactions: true,
        pendingTransactions: true,
        failedTransactions: true,
      },
      where: {
        date: { gte: from, lte: to },
      },
    });

    return {
      completedTransactions: result._sum.completedTransactions ?? 0,
      pendingTransactions: result._sum.pendingTransactions ?? 0,
      failedTransactions: result._sum.failedTransactions ?? 0,
    };
  },

  async getWeeklyProductStats({ from, to }: { from: Date; to: Date }) {
    // Get the latest record in this period for snapshot metrics
    const latestMetric = await prisma.dailyMetrics.findFirst({
      where: { date: { gte: from, lte: to } },
      orderBy: { date: "desc" },
    });

    // If no daily metrics exist, get current product counts directly
    if (!latestMetric) {
      const totalProducts = await prisma.product.count({
        where: { deletedAt: null },
      });
      const inStockProducts = await prisma.product.count({
        where: { deletedAt: null, stockQuantity: { gt: 0 } },
      });
      const outOfStockProducts = await prisma.product.count({
        where: { deletedAt: null, stockQuantity: { lte: 0 } },
      });

      return {
        totalProducts,
        inStockProducts,
        outOfStockProducts,
      };
    }

    return {
      totalProducts: latestMetric.totalProducts ?? 0,
      inStockProducts: latestMetric.inStockProducts ?? 0,
      outOfStockProducts: latestMetric.outOfStockProducts ?? 0,
    };
  },

  async getDailyMetricsInRange({ from, to }: { from: Date; to: Date }) {
    const metrics = await prisma.dailyMetrics.findMany({
      where: {
        date: { gte: from, lte: to },
      },
      orderBy: { date: "asc" },
    });

    return metrics;
  },

  async getRealTimeStats() {
    const stats = await prisma.dailyMetrics.findFirst({
      orderBy: { date: "desc" },
    });
    return stats;
  },
};
