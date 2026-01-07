import { useState, useMemo } from "react";
import { useGetDetailedDailyMetricsQuery } from "@/lib/store/services/analytics/analyticsApi";

export function useCustomerOverview() {
  const [timeRange, setTimeRange] = useState("this-week");
  const [activeTab, setActiveTab] = useState("activeCustomers");

  const { data: analyticsData, isLoading } = useGetDetailedDailyMetricsQuery();

  const metrics = useMemo(() => {
    if (!analyticsData) return [];
    return timeRange === "this-week"
      ? analyticsData.data.customerOverview.thisWeek
      : analyticsData.data.customerOverview.lastWeek;
  }, [analyticsData, timeRange]);

  const stats = useMemo(() => {
    if (!metrics.length) {
      return {
        activeCustomers: 0,
        repeatCustomers: 0,
        shopVisitor: 0,
        conversionRate: "0%",
      };
    }

    const maxActive = metrics.reduce(
      (max, m) => Math.max(max, m.activeCustomers),
      0
    );
    const totalRepeat = metrics.reduce((sum, m) => sum + m.repeatCustomers, 0);
    const totalVisitors = metrics.reduce((sum, m) => sum + m.shopVisitor, 0);
    const totalConversion = metrics.reduce(
      (sum, m) => sum + (m.conversionRate || 0),
      0
    );
    const avgConversion = totalConversion / (metrics.length || 1);

    return {
      activeCustomers: maxActive,
      repeatCustomers: totalRepeat,
      shopVisitor: totalVisitors,
      conversionRate: `${(Number.isNaN(avgConversion)
        ? 0
        : avgConversion
      ).toFixed(1)}%`,
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
