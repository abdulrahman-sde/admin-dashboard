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
    const products = await prisma.product.aggregate({
      _count: {
        id: true,
      },
      where: {
        deletedAt: null,
      },
    });

    const inStock = await prisma.product.count({
      where: {
        stockQuantity: { gt: 0 },
        deletedAt: null,
      },
    });

    const outOfStock = await prisma.product.count({
      where: {
        stockQuantity: 0,
        deletedAt: null,
      },
    });

    return {
      totalProducts: products._count.id,
      inStockProducts: inStock,
      outOfStockProducts: outOfStock,
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
    // Combine Session Counts into one Aggregation
    const rawSessionMetrics = (await prisma.session.aggregateRaw({
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
          },
        },
        {
          $project: {
            totalVisits: { $arrayElemAt: ["$totalVisits.count", 0] },
            uniqueVisits: { $arrayElemAt: ["$uniqueVisits.count", 0] },
          },
        },
      ],
    })) as unknown as RawSessionMetrics[];

    const sessionStats = rawSessionMetrics[0] || {};

    // Page views must be queried from session_events
    const totalPageViews = await prisma.sessionEvent.count({
      where: {
        timestamp: { gte: startOfDay, lt: endOfDay },
        eventType: "page_view",
      },
    });

    return {
      totalVisits: Number(sessionStats.totalVisits || 0),
      uniqueVisits: Number(sessionStats.uniqueVisits || 0),
      totalPageViews,
    };
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
    const result = await prisma.dailyMetrics.aggregate({
      _sum: {
        totalProducts: true,
        inStockProducts: true,
        outOfStockProducts: true,
      },
      where: {
        date: { gte: from, lte: to },
      },
    });

    return {
      totalProducts: result._sum.totalProducts ?? 0,
      inStockProducts: result._sum.inStockProducts ?? 0,
      outOfStockProducts: result._sum.outOfStockProducts ?? 0,
    };
  },

  async getTopProducts(limit: number = 10) {
    return prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { totalSales: "desc" },
      take: limit,
    });
  },
};
