import { analyticsRepository } from "../repositories/analytics.repository.js";
import { getTwoWeekRollingRange } from "../utils/date.utils.js";
import { getWeeklyStats, setWeeklyStats } from "../utils/redis.utils.js";
import type {
  DashboardWeeklyStats,
  DetailedDailyMetricsResponse,
} from "../types/analytics.types.js";
import {
  formatCustomerOverviewMetrics,
  formatReportMetrics,
} from "../utils/analytics.utils.js";

export const analyticsService = {
  async getTwoWeekStats(): Promise<DashboardWeeklyStats> {
    const { thisWeek, previousWeek } = getTwoWeekRollingRange();

    // Create a key based on the start date of this week
    const dateKey = thisWeek.from.toISOString().split("T")[0] || "current";
    const cachedData = await getWeeklyStats(dateKey);

    if (cachedData) {
      console.log("Using cached data");
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
    ] = await Promise.all([
      analyticsRepository.getWeeklyOrderStats(thisWeek),
      analyticsRepository.getWeeklyOrderStats(previousWeek),
      analyticsRepository.getWeeklyCustomerStats(thisWeek),
      analyticsRepository.getWeeklyCustomerStats(previousWeek),
      analyticsRepository.getWeeklyTransactionStats(thisWeek),
      analyticsRepository.getWeeklyTransactionStats(previousWeek),
      analyticsRepository.getWeeklyProductStats(thisWeek),
      analyticsRepository.getWeeklyProductStats(previousWeek),
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
      },
    };

    // Cache the result for 1 hour
    await setWeeklyStats(dateKey, result, 3600);

    return result;
  },

  async getDetailedDailyMetrics(): Promise<DetailedDailyMetricsResponse> {
    const { thisWeek, previousWeek } = getTwoWeekRollingRange();

    const [thisWeekMetrics, previousWeekMetrics] = await Promise.all([
      analyticsRepository.getDailyMetricsInRange(thisWeek),
      analyticsRepository.getDailyMetricsInRange(previousWeek),
    ]);

    return {
      customerOverview: {
        thisWeek: formatCustomerOverviewMetrics(thisWeekMetrics),
        lastWeek: formatCustomerOverviewMetrics(previousWeekMetrics),
      },
      report: {
        thisWeek: formatReportMetrics(thisWeekMetrics),
        lastWeek: formatReportMetrics(previousWeekMetrics),
      },
    };
  },

  // async getTopProducts(limit: number = 10): Promise<Product[]> {
  //    return analyticsRepository.getTopProducts(limit);
  // },

  async getRealTimeStats(): Promise<[]> {
    const stats = await analyticsRepository.getRealTimeStats();
    return stats;
  },
};

export default analyticsService;
