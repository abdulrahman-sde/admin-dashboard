import { analyticsRepository } from "../repositories/analytics.repository.js";
import { productRepository } from "../repositories/products.repository.js";
import { getYesterdayRange } from "../utils/date.utils.js";

export const cronService = {
  async runDailyAnalyticsAggregation() {
    const { startOfDay, endOfDay } = getYesterdayRange();

    try {
      await this.aggregateDailySnapshot(startOfDay, endOfDay);
      await this.syncProductPopularity(startOfDay, endOfDay);
    } catch (error: unknown) {
      console.error(
        "❌ [Cron Service] Critical Failure in Analytics Job:",
        error instanceof Error ? error.message : error
      );
    }
  },

  async aggregateDailySnapshot(startOfDay: Date, endOfDay: Date) {
    const [
      orderMetrics,
      sessionMetrics,
      transactionMetrics,
      productMetrics,
      newCustomers,
      salesByCountry,
      visitsByDevice,
    ] = await Promise.all([
      analyticsRepository.getOrderMetrics(startOfDay, endOfDay),
      analyticsRepository.getSessionMetrics(startOfDay, endOfDay),
      analyticsRepository.getTransactionMetrics(startOfDay, endOfDay),
      analyticsRepository.getProductMetrics(),
      analyticsRepository.getNewCustomersCount(startOfDay, endOfDay),
      analyticsRepository.getSalesByCountry(startOfDay, endOfDay),
      analyticsRepository.getVisitsByDevice(startOfDay, endOfDay),
    ]);

    const totalCustomers = await analyticsRepository.getTotalCustomersCount();

    const totalVisits = sessionMetrics.totalVisits;
    const totalOrders = orderMetrics.totalOrders;

    const conversionRate =
      totalVisits > 0 ? (totalOrders / totalVisits) * 100 : 0;

    const snapshotData = {
      totalVisits,
      uniqueVisits: sessionMetrics.uniqueVisits,
      totalPageViews: sessionMetrics.totalPageViews,

      totalOrders,
      totalSales: orderMetrics.totalSales,
      completedOrders: orderMetrics.completedOrders,
      pendingOrders: orderMetrics.pendingOrders,
      shippedOrders: orderMetrics.shippedOrders,
      processingOrders: orderMetrics.processingOrders,
      cancelledOrders: orderMetrics.cancelledOrders,
      averageOrderValue:
        totalOrders > 0 ? orderMetrics.totalSales / totalOrders : 0,

      completedTransactions: transactionMetrics.completedTransactions,
      pendingTransactions: transactionMetrics.pendingTransactions,
      failedTransactions: transactionMetrics.failedTransactions,

      conversionRate,
      cartRate:
        totalVisits > 0
          ? (sessionMetrics.addToCartCount / totalVisits) * 100
          : 0,
      checkoutRate:
        totalVisits > 0
          ? (sessionMetrics.checkoutStartedCount / totalVisits) * 100
          : 0,
      purchaseRate: conversionRate,

      newCustomers,
      returningCustomers: orderMetrics.returningCustomers,
      totalCustomers,

      totalProducts: productMetrics.totalProducts,
      inStockProducts: productMetrics.inStockProducts,
      outOfStockProducts: productMetrics.outOfStockProducts,

      salesByCountry,
      visitsByDevice,
    };

    await analyticsRepository.upsertDailyMetrics(startOfDay, snapshotData);
  },

  async syncProductPopularity(startOfDay: Date, endOfDay: Date) {
    const productViews = await analyticsRepository.getProductViewMetrics(
      startOfDay,
      endOfDay
    );

    for (const view of productViews) {
      if (!view.productId) continue;
      await productRepository.incrementViewCount(
        view.productId,
        view._count.id
      );
    }
  },
};
