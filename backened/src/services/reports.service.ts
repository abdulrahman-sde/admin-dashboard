import { analyticsRepository } from "../repositories/analytics.repository.js";
import { monthlyGoalsRepository } from "../repositories/monthly-goals.repository.js";
import type { DailyMetrics } from "@prisma/client";

export const reportsService = {
  async getReportsData(startDate?: string, endDate?: string) {
    if (startDate && endDate) {
      const from = new Date(startDate);
      const to = new Date(endDate);

      // Calculate duration to get previous period
      const durationMs = to.getTime() - from.getTime();
      const prevFrom = new Date(from.getTime() - durationMs);
      const prevTo = new Date(from);

      const [currentMetrics, prevMetrics] = await Promise.all([
        analyticsRepository.getDailyMetricsInRange({ from, to }),
        analyticsRepository.getDailyMetricsInRange({
          from: prevFrom,
          to: prevTo,
        }),
      ]);

      return await this.formatFilteredReportsData(
        currentMetrics,
        prevMetrics,
        from,
        to
      );
    }

    // Default implementation (can be expanded if needed)
    // For now, if no dates provided, we could return a default range (e.g., last 30 days)
    // but the user only specified the behavior FOR when dates are provided.
    return null;
  },

  async formatFilteredReportsData(
    current: DailyMetrics[],
    prev: DailyMetrics[],
    from: Date,
    to: Date
  ) {
    const aggregate = (metrics: DailyMetrics[]) => ({
      existingUsers: metrics.reduce((sum, m) => sum + m.returningCustomers, 0),
      newUsers: metrics.reduce((sum, m) => sum + m.newCustomers, 0),
      totalVisits: metrics.reduce((sum, m) => sum + m.totalVisits, 0),
      uniqueVisits: metrics.reduce((sum, m) => sum + m.uniqueVisits, 0),
      totalSales: metrics.reduce((sum, m) => sum + m.totalSales, 0),
      totalOrders: metrics.reduce((sum, m) => sum + m.totalOrders, 0),
      // For rates, we'll use simple averages for now
      avgCartRate:
        metrics.length > 0
          ? metrics.reduce((sum, m) => sum + (m.cartRate || 0), 0) /
            metrics.length
          : 0,
      avgCheckoutRate:
        metrics.length > 0
          ? metrics.reduce((sum, m) => sum + (m.checkoutRate || 0), 0) /
            metrics.length
          : 0,
      avgPurchaseRate:
        metrics.length > 0
          ? metrics.reduce((sum, m) => sum + (m.purchaseRate || 0), 0) /
            metrics.length
          : 0,
      avgConversionRate:
        metrics.length > 0
          ? metrics.reduce((sum, m) => sum + (m.conversionRate || 0), 0) /
            metrics.length
          : 0,
    });

    const currAgg = aggregate(current);
    const prevAgg = aggregate(prev);

    const calculateChange = (curr: number, prevVal: number) => {
      if (prevVal === 0) return curr > 0 ? 100 : 0;
      return ((curr - prevVal) / prevVal) * 100;
    };

    // Customer Growth Data (Grouped by month if spanning multiple months)
    const customerGrowthData = this.groupDataByMonth(current);

    // Key Metrics
    const keyMetrics = {
      existingUsers: {
        value: currAgg.existingUsers.toLocaleString(),
        change: calculateChange(currAgg.existingUsers, prevAgg.existingUsers),
        isPositive: currAgg.existingUsers >= prevAgg.existingUsers,
      },
      newUsers: {
        value: currAgg.newUsers.toLocaleString(),
        change: calculateChange(currAgg.newUsers, prevAgg.newUsers),
        isPositive: currAgg.newUsers >= prevAgg.newUsers,
      },
      totalVisits: {
        value: currAgg.totalVisits.toLocaleString(),
        change: calculateChange(currAgg.totalVisits, prevAgg.totalVisits),
        isPositive: currAgg.totalVisits >= prevAgg.totalVisits,
      },
      uniqueVisits: {
        value: currAgg.uniqueVisits.toLocaleString(),
        change: calculateChange(currAgg.uniqueVisits, prevAgg.uniqueVisits),
        isPositive: currAgg.uniqueVisits >= prevAgg.uniqueVisits,
      },
    };

    // Sales Goal
    const lastDate =
      current.length > 0 ? current[current.length - 1]?.date : to;
    const monthKey = lastDate
      ? `${lastDate.getUTCFullYear()}-${String(
          lastDate.getUTCMonth() + 1
        ).padStart(2, "0")}`
      : "";
    const monthlyGoal = await monthlyGoalsRepository.findByMonth(monthKey);
    const goalValue = monthlyGoal?.goalAmount || 20000;

    const salesGoal = {
      percentage: Math.round((currAgg.totalSales / goalValue) * 100),
      soldFor: currAgg.totalSales,
      monthGoal: goalValue,
      left: Math.max(0, goalValue - currAgg.totalSales),
    };

    // Conversion Rate
    const conversionRate = {
      percentage: Math.round(currAgg.avgConversionRate),
      cart: Math.round(currAgg.avgCartRate),
      checkout: Math.round(currAgg.avgCheckoutRate),
      purchase: Math.round(currAgg.avgPurchaseRate),
    };

    // Average Order Value
    const avgOrderValue = {
      thisMonth:
        currAgg.totalOrders > 0 ? currAgg.totalSales / currAgg.totalOrders : 0,
      prevMonth:
        prevAgg.totalOrders > 0 ? prevAgg.totalSales / prevAgg.totalOrders : 0,
      trend: current.map((m) => ({
        time: m.date.toISOString().split("T")[0],
        value: m.averageOrderValue || 0,
      })),
    };

    return {
      customerGrowthData,
      keyMetrics,
      salesGoal,
      conversionRate,
      avgOrderValue,
    };
  },

  groupDataByMonth(metrics: DailyMetrics[]) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const result: any[] = [];
    const now = new Date();
    const currentUTCMonth = now.getUTCMonth();
    const currentUTCYear = now.getUTCFullYear();

    // Initialize the last 12 months with zeros in chronological order
    for (let i = 11; i >= 0; i--) {
      // Use Date.UTC to ensure we are working with the exact month/year without timezone shifts
      const targetMonth = currentUTCMonth - i;
      const d = new Date(Date.UTC(currentUTCYear, targetMonth, 1));
      const mIdx = d.getUTCMonth();
      const y = d.getUTCFullYear();

      result.push({
        month: months[mIdx],
        newCustomers: 0,
        returningCustomers: 0,
        _key: `${y}-${mIdx}`,
      });
    }

    // Fill in actual data
    metrics.forEach((m) => {
      const d = new Date(m.date);
      const y = d.getUTCFullYear();
      const mIdx = d.getUTCMonth();
      const key = `${y}-${mIdx}`;

      const entry = result.find((r) => r._key === key);
      if (entry) {
        entry.newCustomers += m.newCustomers;
        entry.returningCustomers += m.returningCustomers;
      }
    });

    return result.map(({ _key, ...rest }) => rest);
  },
};
