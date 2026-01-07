import { useState, useMemo } from "react";
import { useGetDetailedDailyMetricsQuery } from "@/lib/store/services/analytics/analyticsApi";

export function useWeeklyReport() {
  const [timeRange, setTimeRange] = useState("this-week");
  const [activeTab, setActiveTab] = useState("revenue");

  const { data: analyticsData, isLoading } = useGetDetailedDailyMetricsQuery();

  const metrics = useMemo(() => {
    if (!analyticsData) return [];
    return timeRange === "this-week"
      ? analyticsData.data.report.thisWeek
      : analyticsData.data.report.lastWeek;
  }, [analyticsData, timeRange]);

  const stats = useMemo(() => {
    if (!metrics.length) {
      return {
        customers: 0,
        totalProducts: 0,
        stockProducts: 0,
        outOfStock: 0,
        revenue: 0,
      };
    }

    const totalCustomers = metrics.reduce((sum, m) => sum + m.customers, 0);
    const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
    const latest = metrics[metrics.length - 1];

    return {
      customers: totalCustomers,
      totalProducts: latest.totalProducts,
      stockProducts: latest.stockProducts,
      outOfStock: latest.outOfStock,
      revenue: totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    };
  }, [metrics]);

  return {
    timeRange,
    setTimeRange,
    activeTab,
    setActiveTab,
    metrics,
    stats,
    isLoading,
  };
}
