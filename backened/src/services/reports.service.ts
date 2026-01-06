import { analyticsRepository } from "../repositories/analytics.repository.js";
import { monthlyGoalsRepository } from "../repositories/monthly-goals.repository.js";
import { customerRepository } from "../repositories/customers.repository.js";
import { productRepository } from "../repositories/products.repository.js";
import type { DailyMetrics } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export const reportsService = {
  /**
   * Get reports data for a specific date range
   */
  async getReportsData(startDate?: string, endDate?: string) {
    if (startDate && endDate) {
      const from = new Date(startDate);
      const to = new Date(endDate);

      // We only need the current range (e.g. 1 year) to derive both long-term trends AND current month stats
      const currentMetrics = await analyticsRepository.getDailyMetricsInRange({
        from,
        to,
      });

      return await this.formatFilteredReportsData(currentMetrics, from, to);
    }
    return null;
  },

  /**
   * Get customer demographics (all-time data)
   */
  async getCustomerDemographics() {
    const allMetrics = await analyticsRepository.getDailyMetricsInRange({
      from: new Date("2020-01-01"),
      to: new Date(),
    });

    const latestMetric =
      allMetrics.length > 0 ? allMetrics[allMetrics.length - 1] : null;

    const salesByCountry =
      (latestMetric?.salesByCountry as Record<string, number>) || {};

    const demographics = Object.entries(salesByCountry).map(
      ([country, sales]) => ({
        country,
        sales,
      })
    );

    return {
      totalCustomers: latestMetric?.totalCustomers || 0,
      demographics,
    };
  },

  /**
   * Get top customers by total spent
   */
  async getTopCustomers(limit: number = 5) {
    const { customers } = await customerRepository.findAll({
      skip: 0,
      take: limit,
      where: { deletedAt: null },
      orderBy: { totalSpent: "desc" },
    });

    return customers.map((customer) => ({
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      avatar: undefined,
      orders: customer.totalOrders,
      spent: customer.totalSpent,
    }));
  },

  /**
   * Get top products by total sales
   */
  async getTopProducts(limit: number = 5) {
    const { products: topProducts } = await productRepository.getAll({
      skip: 0,
      take: limit,
      orderBy: { totalSales: "desc" },
      where: { deletedAt: null },
    });

    return topProducts.map((product) => ({
      id: product.id,
      name: product.name,
      image: product.thumbnail,
      clicks: product.viewCount,
      unitsSold: product.totalSales,
      category: (product as any).category?.name || "Uncategorized",
    }));
  },

  /**
   * Get active sessions (approximate from recent database activity)
   */
  async getActiveSessions() {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      const activeStats = await prisma.session.aggregate({
        _count: { id: true },
        where: {
          lastSeenAt: { gte: thirtyMinutesAgo },
        },
      });

      const deviceStats = await prisma.session.groupBy({
        by: ["device"],
        _count: { id: true },
        where: { lastSeenAt: { gte: thirtyMinutesAgo } },
      });

      const deviceBreakdown: Record<string, number> = {
        mobile: 0,
        desktop: 0,
        tablet: 0,
      };

      deviceStats.forEach((stat) => {
        if (stat.device) deviceBreakdown[stat.device] = stat._count.id;
      });

      return {
        activeUsers: activeStats._count.id,
        deviceBreakdown,
      };
    } catch (error) {
      console.error("Error fetching active sessions:", error);
      return {
        activeUsers: 0,
        deviceBreakdown: {
          mobile: 0,
          desktop: 0,
          tablet: 0,
        },
      };
    }
  },

  /**
   * Get device analytics
   */
  async getDeviceAnalytics(startDate?: string, endDate?: string) {
    let metrics: DailyMetrics[];

    if (startDate && endDate) {
      metrics = await analyticsRepository.getDailyMetricsInRange({
        from: new Date(startDate),
        to: new Date(endDate),
      });
    } else {
      // Default to last 30 days
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 30);
      metrics = await analyticsRepository.getDailyMetricsInRange({ from, to });
    }

    const deviceTotals: Record<string, number> = {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    };

    for (const metric of metrics) {
      const visitsByDevice =
        (metric.visitsByDevice as Record<string, number>) || {};
      for (const [device, count] of Object.entries(visitsByDevice)) {
        deviceTotals[device] = (deviceTotals[device] || 0) + count;
      }
    }

    const total = Object.values(deviceTotals).reduce(
      (sum, count) => sum + count,
      0
    );

    return {
      devices: Object.entries(deviceTotals).map(([device, count]) => ({
        device,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      })),
      total,
    };
  },

  async formatFilteredReportsData(
    current: DailyMetrics[],
    from: Date,
    to: Date
  ) {
    // 1. Growth Data: Use the FULL provided range (likely 12 months)
    const customerGrowthData = this.groupDataByMonth(current);

    // 2. Card/Snapshot Data: Use "Current Month" vs "Previous Month" logic
    // Sort to be sure
    const sorted = [...current].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Identify the "Current Month" bucket based on the 'to' date or last available date
    const lastEntry = sorted[sorted.length - 1];
    const anchorDate = lastEntry ? new Date(lastEntry.date) : new Date();
    const currentMonthStart = new Date(
      Date.UTC(anchorDate.getUTCFullYear(), anchorDate.getUTCMonth(), 1)
    );
    const prevMonthStart = new Date(
      Date.UTC(anchorDate.getUTCFullYear(), anchorDate.getUTCMonth() - 1, 1)
    );

    // Filter metrics
    const thisMonthMetrics = sorted.filter(
      (m) => new Date(m.date) >= currentMonthStart
    );
    const prevMonthMetricsFull = sorted.filter((m) => {
      const d = new Date(m.date);
      return d >= prevMonthStart && d < currentMonthStart;
    });

    // For comparison, use same number of days (e.g. 1st-5th vs 1st-5th)
    const daysElapsed = thisMonthMetrics.length;
    const prevMonthMetrics = prevMonthMetricsFull.slice(0, daysElapsed);

    const aggregate = (metrics: DailyMetrics[]) => ({
      existingUsers: metrics.reduce((sum, m) => sum + m.returningCustomers, 0),
      newUsers: metrics.reduce((sum, m) => sum + m.newCustomers, 0),
      totalVisits: metrics.reduce((sum, m) => sum + m.totalVisits, 0),
      uniqueVisits: metrics.reduce((sum, m) => sum + m.uniqueVisits, 0),
      totalSales: metrics.reduce((sum, m) => sum + m.totalSales, 0),
      totalOrders: metrics.reduce((sum, m) => sum + m.totalOrders, 0),
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

    const currAgg = aggregate(thisMonthMetrics);
    const prevAgg = aggregate(prevMonthMetrics);

    const calculateChange = (curr: number, prevVal: number) => {
      if (prevVal === 0) return curr > 0 ? 100 : 0;
      return ((curr - prevVal) / prevVal) * 100;
    };

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
    const monthKey = `${anchorDate.getUTCFullYear()}-${String(
      anchorDate.getUTCMonth() + 1
    ).padStart(2, "0")}`;
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
      // Trend uses DAILY data for the current month
      trend: thisMonthMetrics.map((m) => ({
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

    // Last 12 months
    for (let i = 11; i >= 0; i--) {
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
