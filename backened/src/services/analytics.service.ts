import { analyticsRepository } from "../repositories/analytics.repository.js";
import type { AggregationResult } from "../types/job.types.js";
import { getTwoWeekRollingRange } from "../utils/date.utils.js";
import { getWeeklyStats, setWeeklyStats } from "../utils/redis.utils.js";
import type { DashboardWeeklyStats } from "../types/analytics.types.js";

export const analyticsService = {
  async calculateAndSaveDailyMetrics(
    startOfDay: Date,
    endOfDay: Date
  ): Promise<AggregationResult> {
    const [
      orderMetrics,
      productMetrics,
      newCustomersCount,
      totalCustomersCount,
      sessionMetrics,
      transactionMetrics,
    ] = await Promise.all([
      analyticsRepository.getOrderMetrics(startOfDay, endOfDay),
      analyticsRepository.getProductMetrics(), // Global snapshot
      analyticsRepository.getNewCustomersCount(startOfDay, endOfDay),
      analyticsRepository.getTotalCustomersCount(),
      analyticsRepository.getSessionMetrics(startOfDay, endOfDay),
      analyticsRepository.getTransactionMetrics(startOfDay, endOfDay),
    ]);

    // Process Order Metrics Since they are already processed in repo
    const {
      totalOrders,
      totalSales,
      completedOrders,
      cancelledOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      newOrders,
      returningCustomers,
    } = orderMetrics;

    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Process Other Metrics
    const { totalProducts, inStockProducts, outOfStockProducts } =
      productMetrics;
    const newCustomers = newCustomersCount;
    const totalCustomers = totalCustomersCount;
    const { totalVisits, uniqueVisits, totalPageViews } = sessionMetrics;
    const { completedTransactions, pendingTransactions, failedTransactions } =
      transactionMetrics;

    // Conversion Rate
    const conversionRate =
      totalVisits > 0 ? (totalOrders / totalVisits) * 100 : 0;

    // Prepare Payload
    const metricsData: AggregationResult = {
      totalOrders,
      totalSales,
      completedOrders,
      cancelledOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      newOrders,
      averageOrderValue,
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      newCustomers,
      returningCustomers,
      totalCustomers,
      totalVisits,
      uniqueVisits,
      totalPageViews,
      conversionRate,
      completedTransactions,
      pendingTransactions,
      failedTransactions,
    };

    // Upsert to DB
    await analyticsRepository.upsertDailyMetrics(startOfDay, metricsData);

    return metricsData;
  },

  async getTwoWeekStats(): Promise<DashboardWeeklyStats> {
    const { thisWeek, previousWeek } = getTwoWeekRollingRange();

    // Create a key based on the start date of this week
    const dateKey = thisWeek.from.toISOString().split("T")[0] || "current";
    const cachedData = await getWeeklyStats(dateKey);

    if (cachedData) {
      console.log("Using cached data");
      console.log(cachedData);
      return cachedData;
    }

    const [
      thisWeekOrders,
      previousWeekOrders,
      thisWeekCustomers,
      previousWeekCustomers,
      thisWeekTransactions,
      previousWeekTransactions,
      thisWeekProducts,
      previousWeekProducts,
      topProducts,
    ] = await Promise.all([
      analyticsRepository.getWeeklyOrderStats(thisWeek),
      analyticsRepository.getWeeklyOrderStats(previousWeek),
      analyticsRepository.getWeeklyCustomerStats(thisWeek),
      analyticsRepository.getWeeklyCustomerStats(previousWeek),
      analyticsRepository.getWeeklyTransactionStats(thisWeek),
      analyticsRepository.getWeeklyTransactionStats(previousWeek),
      analyticsRepository.getWeeklyProductStats(thisWeek),
      analyticsRepository.getWeeklyProductStats(previousWeek),
      analyticsRepository.getTopProducts(10),
    ]);

    const result: DashboardWeeklyStats = {
      orders: {
        thisWeek: thisWeekOrders,
        previousWeek: previousWeekOrders,
      },
      customers: {
        thisWeek: thisWeekCustomers,
        previousWeek: previousWeekCustomers,
      },
      transactions: {
        thisWeek: thisWeekTransactions,
        previousWeek: previousWeekTransactions,
      },
      products: {
        thisWeek: thisWeekProducts,
        previousWeek: previousWeekProducts,
        topProducts,
      },
    };

    // Cache the result for 1 hour
    await setWeeklyStats(dateKey, result, 3600);

    return result;
  },
};

// analyticsService.getTwoWeekStats();
