import { analyticsRepository } from "../repositories/analytics.repository.js";
import { monthlyGoalsRepository } from "../repositories/monthly-goals.repository.js";
import { customerRepository } from "../repositories/customers.repository.js";
import { productRepository } from "../repositories/products.repository.js";
import type { DailyMetrics } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { redis, getSession } from "../utils/redis.utils.js";
import type { RedisSessionData } from "../types/session.types.js";

export const reportsService = {
  async getReportsData(startDate?: string, endDate?: string) {
    if (startDate && endDate) {
      const from = new Date(startDate);
      const to = new Date(endDate);

      const currentMetrics = await analyticsRepository.getDailyMetricsInRange({
        from,
        to,
      });

      return await this.formatFilteredReportsData(currentMetrics, from, to);
    }
    return null;
  },

  async getCustomerDemographics() {
    const customers = await prisma.customer.findMany({
      where: { deletedAt: null },
      select: { address: true },
    });

    const countryCounts: Record<string, number> = {};
    customers.forEach((c) => {
      const country = c.address?.country || "Unknown";
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    const demographics = Object.entries(countryCounts)
      .map(([country, sales]) => ({
        country,
        sales,
      }))
      .sort((a, b) => b.sales - a.sales);

    return {
      totalCustomers: customers.length,
      demographics,
    };
  },

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
      category: product.category?.name || "Uncategorized",
    }));
  },

  async getActiveSessions() {
    try {
      const keys = await redis.keys("session:*");
      const activeUsers = keys.length;

      const deviceBreakdown: Record<string, number> = {
        mobile: 0,
        desktop: 0,
        tablet: 0,
      };

      if (activeUsers > 0) {
        const sessionPromises = keys.map((key: string) => {
          const sessionId = key.replace("session:", "");
          return getSession(sessionId);
        });

        const sessions = await Promise.all(sessionPromises);

        sessions.forEach((session: RedisSessionData | null) => {
          if (session && session.device) {
            const device = session.device.toLowerCase();
            if (device in deviceBreakdown) {
              (deviceBreakdown as any)[device]++;
            }
          }
        });
      }

      return {
        activeUsers,
        deviceBreakdown,
      };
    } catch (error) {
      console.error("Error fetching active sessions from Redis:", error);
      return {
        activeUsers: 0,
        deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
      };
    }
  },

  async getDeviceAnalytics(startDate?: string, endDate?: string) {
    let whereClause: any = {};

    if (startDate && endDate) {
      whereClause = {
        startedAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    }

    const deviceStats = await prisma.session.groupBy({
      by: ["device"],
      _count: { id: true },
      where: whereClause,
    });

    const deviceTotals: Record<string, number> = {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    };

    let total = 0;

    deviceStats.forEach((stat) => {
      const device = stat.device ? stat.device.toLowerCase() : "desktop"; // Default to desktop if missing
      const count = stat._count.id;
      if (deviceTotals[device] !== undefined) {
        deviceTotals[device] = (deviceTotals[device] || 0) + count;
      } else {
        // Fallback for others or map 'phone' -> mobile
        if (device.includes("mobile") || device.includes("phone"))
          deviceTotals["mobile"] = (deviceTotals["mobile"] || 0) + count;
        else if (device.includes("tablet") || device.includes("ipad"))
          deviceTotals["tablet"] = (deviceTotals["tablet"] || 0) + count;
        else deviceTotals["desktop"] = (deviceTotals["desktop"] || 0) + count;
      }
      total += count;
    });

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
    // Growth data respects the provided from/to range
    const customerGrowthData = this.groupDataByMonth(current, from, to);

    const now = new Date();
    // Use the actual current month for key metrics
    const currentMonthStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
    );
    const prevMonthStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)
    );

    // Fetch metrics needed for MoM comparison and AOV trend
    const rangeStart = new Date(prevMonthStart);
    const wideRangeMetrics = await analyticsRepository.getDailyMetricsInRange({
      from: rangeStart,
      to: now,
    });

    // Also fetch lifetime visits from all metrics
    const allMetrics = await prisma.dailyMetrics.aggregate({
      _sum: { totalVisits: true },
    });
    const lifetimeVisits = allMetrics._sum.totalVisits || 0;

    const sorted = [...wideRangeMetrics].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const thisMonthMetrics = sorted.filter(
      (m) => new Date(m.date) >= currentMonthStart
    );
    const prevMonthMetricsFull = sorted.filter((m) => {
      const d = new Date(m.date);
      return d >= prevMonthStart && d < currentMonthStart;
    });

    // For comparison, use same number of days from previous month if it's the current ongoing month
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
      returningUsers: {
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
        value: lifetimeVisits.toLocaleString(),
        change: calculateChange(currAgg.totalVisits, prevAgg.totalVisits),
        isPositive: currAgg.totalVisits >= prevAgg.totalVisits,
      },
      uniqueVisits: {
        value: currAgg.uniqueVisits.toLocaleString(),
        change: calculateChange(currAgg.uniqueVisits, prevAgg.uniqueVisits),
        isPositive: currAgg.uniqueVisits >= prevAgg.uniqueVisits,
      },
    };

    const monthKey = `${now.getUTCFullYear()}-${String(
      now.getUTCMonth() + 1
    ).padStart(2, "0")}`;
    const monthlyGoal = await monthlyGoalsRepository.findByMonth(monthKey);
    const goalValue = monthlyGoal?.goalAmount || 20000;

    const salesGoal = {
      percentage: Math.round((currAgg.totalSales / goalValue) * 100),
      soldFor: currAgg.totalSales,
      monthGoal: goalValue,
      left: Math.max(0, goalValue - currAgg.totalSales),
    };

    const conversionRate = {
      percentage: Math.round(currAgg.avgConversionRate),
      cart: Math.round(currAgg.avgCartRate),
      checkout: Math.round(currAgg.avgCheckoutRate),
      purchase: Math.round(currAgg.avgPurchaseRate),
    };

    // AOV trend for last 4 days
    const last4DaysMetrics = sorted.slice(-4);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const avgOrderValue = {
      thisMonth:
        currAgg.totalOrders > 0 ? currAgg.totalSales / currAgg.totalOrders : 0,
      prevMonth:
        prevAgg.totalOrders > 0 ? prevAgg.totalSales / prevAgg.totalOrders : 0,
      trend: last4DaysMetrics.map((m) => {
        const d = new Date(m.date);
        return {
          time: dayNames[d.getUTCDay()],
          value: m.averageOrderValue || 0,
        };
      }),
    };

    return {
      customerGrowthData,
      keyMetrics,
      salesGoal,
      conversionRate,
      avgOrderValue,
    };
  },

  groupDataByMonth(metrics: DailyMetrics[], from: Date, to: Date) {
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

    interface MonthlyGrowthData {
      month: string;
      newCustomers: number;
      returningCustomers: number;
      _key: string;
    }

    const result: MonthlyGrowthData[] = [];

    // Calculate number of months between from and to
    const startY = from.getUTCFullYear();
    const startM = from.getUTCMonth();
    const endY = to.getUTCFullYear();
    const endM = to.getUTCMonth();

    const numMonths = (endY - startY) * 12 + (endM - startM);

    for (let i = numMonths; i >= 0; i--) {
      const d = new Date(Date.UTC(endY, endM - i, 1));
      const mIdx = d.getUTCMonth();
      const y = d.getUTCFullYear();

      result.push({
        month: months[mIdx] as string,
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
