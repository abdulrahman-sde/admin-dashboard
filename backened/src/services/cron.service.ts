import { analyticsRepository } from "../repositories/analytics.repository.js";
import { productRepository } from "../repositories/products.repository.js";
import { getYesterdayRange } from "../utils/date.utils.js";

/**
 * Cron Service
 * Contains the business logic for background tasks and automated aggregations.
 * This service is called by scheduled jobs (triggers) in the src/jobs directory.
 */
export const cronService = {
  /**
   * Orchestrates the daily analytics aggregation process.
   */
  async runDailyAnalyticsAggregation() {
    console.log("🔄 [Cron Service] Starting Daily Analytics Aggregation...");

    // 1. Determine the time range (Yesterday 00:00 to 23:59 UTC)
    const { startOfDay, endOfDay } = getYesterdayRange();

    try {
      // 2. Execute business logic for data aggregation
      await this.aggregateDailySnapshot(startOfDay, endOfDay);

      // 3. Update product popularity metrics (denormalization)
      await this.syncProductPopularity(startOfDay, endOfDay);

      console.log("✅ [Cron Service] Daily Analytics Aggregation Completed.");
    } catch (error: any) {
      console.error(
        "❌ [Cron Service] Critical Failure in Analytics Job:",
        error.message
      );
    }
  },

  /**
   * Aggregates all key metrics from Repositories and saves the daily summary.
   */
  async aggregateDailySnapshot(startOfDay: Date, endOfDay: Date) {
    console.log(`📊 Processing Snapshot: ${startOfDay.toISOString()}`);

    // Fetch all metrics in parallel for maximum performance
    // All DB interactions are handled by repositories
    const [
      orderMetrics,
      sessionMetrics,
      transactionMetrics,
      productMetrics,
      newCustomers,
    ] = await Promise.all([
      analyticsRepository.getOrderMetrics(startOfDay, endOfDay),
      analyticsRepository.getSessionMetrics(startOfDay, endOfDay),
      analyticsRepository.getTransactionMetrics(startOfDay, endOfDay),
      analyticsRepository.getProductMetrics(),
      analyticsRepository.getNewCustomersCount(startOfDay, endOfDay),
    ]);

    const totalCustomers = await analyticsRepository.getTotalCustomersCount();

    // Calculate rates and derived fields
    const totalVisits = sessionMetrics.totalVisits;
    const totalOrders = orderMetrics.totalOrders;

    const conversionRate =
      totalVisits > 0 ? (totalOrders / totalVisits) * 100 : 0;

    const snapshotData = {
      // Traffic
      totalVisits,
      uniqueVisits: sessionMetrics.uniqueVisits,
      totalPageViews: sessionMetrics.totalPageViews,

      // Revenue & Order Volumes
      totalOrders,
      totalSales: orderMetrics.totalSales,
      completedOrders: orderMetrics.completedOrders,
      pendingOrders: orderMetrics.pendingOrders,
      shippedOrders: orderMetrics.shippedOrders,
      processingOrders: orderMetrics.processingOrders,
      cancelledOrders: orderMetrics.cancelledOrders,
      averageOrderValue:
        totalOrders > 0 ? orderMetrics.totalSales / totalOrders : 0,

      // Transactions
      completedTransactions: transactionMetrics.completedTransactions,
      pendingTransactions: transactionMetrics.pendingTransactions,
      failedTransactions: transactionMetrics.failedTransactions,

      // Funnel Analysis
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

      // Audience
      newCustomers,
      returningCustomers: orderMetrics.returningCustomers,
      totalCustomers,

      // Inventory Status
      totalProducts: productMetrics.totalProducts,
      inStockProducts: productMetrics.inStockProducts,
      outOfStockProducts: productMetrics.outOfStockProducts,
    };

    // Persistence via Repository
    await analyticsRepository.upsertDailyMetrics(startOfDay, snapshotData);
    console.log(`📈 Daily summary saved for ${startOfDay.toISOString()}`);
  },

  /**
   * Syncs product popularity (view counts) based on raw events.
   */
  async syncProductPopularity(startOfDay: Date, endOfDay: Date) {
    console.log("🏷️ Syncing product popularity metrics...");

    // Fetch view counts via Analytics Repository
    const productViews = await analyticsRepository.getProductViewMetrics(
      startOfDay,
      endOfDay
    );

    // Update each product via Product Repository
    for (const view of productViews) {
      if (!view.productId) continue;
      await productRepository.incrementViewCount(
        view.productId,
        view._count.id
      );
    }
  },
};
