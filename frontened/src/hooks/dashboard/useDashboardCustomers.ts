import { useGetAnalytics } from "@/hooks/analytics/useGetAnalytics";

export const useDashboardCustomers = () => {
  const {
    stats,
    weeklyCustomersChange,
    weeklyNewCustomersChange,
    weeklyVisitsChange,
    isFetching,
  } = useGetAnalytics();

  const dynamicStats = [
    {
      title: "Total Customers",
      value: stats?.customers.thisWeek.totalCustomers ?? 0,
      change: {
        value: Math.abs(weeklyCustomersChange),
        isPositive: weeklyCustomersChange >= 0,
      },
      subtitle: "Last 7 days",
    },
    {
      title: "New Customers",
      value: stats?.customers.thisWeek.newCustomers ?? 0,
      change: {
        value: Math.abs(weeklyNewCustomersChange),
        isPositive: weeklyNewCustomersChange >= 0,
      },
      subtitle: "Last 7 days",
    },
    {
      title: "Visitor",
      value: stats?.customers.thisWeek.totalVisits ?? 0,
      change: {
        value: Math.abs(weeklyVisitsChange),
        isPositive: weeklyVisitsChange >= 0,
      },
      subtitle: "Last 7 days",
    },
  ];

  // Build dynamic customer overview data from analytics

  return {
    dynamicStats,
    isFetching,
    stats,
  };
};
