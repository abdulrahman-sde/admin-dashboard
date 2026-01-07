import { analyticsRepository } from "../repositories/analytics.repository.js";
import { getTwoWeekRollingRange } from "../utils/date.utils.js";
import { getWeeklyStats, setWeeklyStats } from "../utils/redis.utils.js";
import type {
  DashboardWeeklyStats,
  DetailedDailyMetricsResponse,
  RealTimeStats,
} from "../types/analytics.types.js";
import {
  formatCustomerOverviewMetrics,
  formatReportMetrics,
} from "../utils/analytics.utils.js";

export const analyticsService = {
  async getTwoWeekStats(): Promise<DashboardWeeklyStats> {
    const { thisWeek, previousWeek } = getTwoWeekRollingRange();

    const dateKey = thisWeek.from.toISOString().split("T")[0] || "current";
    const cachedData = await getWeeklyStats(dateKey);

    if (cachedData) {
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

  async getRealTimeStats(): Promise<RealTimeStats> {
    const stats = await analyticsRepository.getRealTimeStats();
    return stats;
  },
};

export default analyticsService;
