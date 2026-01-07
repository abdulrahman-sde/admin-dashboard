import { useGetTwoWeekStatsQuery } from "@/lib/store/services/analytics/analyticsApi";

export const useGetAnalytics = () => {
  const { data, isFetching } = useGetTwoWeekStatsQuery();
  let weeklySalesChange = 0;
  let weeklyOrdersChange = 0;
  let weeklyPendingOrdersChange = 0;
  let weeklyCancelledOrderChange = 0;
  let weeklyCustomersChange = 0;
  let weeklyNewCustomersChange = 0;
  let weeklyVisitsChange = 0;

  let countrySalesGrowth: Array<{
    country: string;
    sales: number;
    change: number;
  }> = [];

  const calculateChangeHelper = ({
    current,
    previous,
  }: {
    current: number;
    previous: number;
  }) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  if (data) {
    weeklySalesChange = calculateChangeHelper({
      current: data.data.orders.thisWeek.totalSales,
      previous: data.data.orders.previousWeek.totalSales,
    });

    weeklyOrdersChange = calculateChangeHelper({
      current: data.data.orders.thisWeek.totalOrders,
      previous: data.data.orders.previousWeek.totalOrders,
    });

    weeklyPendingOrdersChange = calculateChangeHelper({
      current: data.data.orders.thisWeek.pendingOrders,
      previous: data.data.orders.previousWeek.pendingOrders,
    });

    weeklyCancelledOrderChange = calculateChangeHelper({
      current: data.data.orders.thisWeek.cancelledOrders,
      previous: data.data.orders.previousWeek.cancelledOrders,
    });

    weeklyCustomersChange = calculateChangeHelper({
      current: data.data.customers.thisWeek.totalCustomers,
      previous: data.data.customers.previousWeek.totalCustomers,
    });

    weeklyNewCustomersChange = calculateChangeHelper({
      current: data.data.customers.thisWeek.newCustomers,
      previous: data.data.customers.previousWeek.newCustomers,
    });

    weeklyVisitsChange = calculateChangeHelper({
      current: data.data.customers.thisWeek.totalVisits,
      previous: data.data.customers.previousWeek.totalVisits,
    });

    const thisWeekCountrySales = data.data.orders.thisWeek.countrySales || {};
    const previousWeekCountrySales =
      data.data.orders.previousWeek.countrySales || {};

    const countries = Array.from(
      new Set([
        ...Object.keys(thisWeekCountrySales),
        ...Object.keys(previousWeekCountrySales),
      ])
    );

    countrySalesGrowth = countries.map((country) => {
      const currentSales = thisWeekCountrySales[country] || 0;
      const previousSales = previousWeekCountrySales[country] || 0;
      return {
        country,
        sales: currentSales,
        change: calculateChangeHelper({
          current: currentSales,
          previous: previousSales,
        }),
      };
    });

    countrySalesGrowth.sort((a, b) => b.sales - a.sales);
  }

  return {
    stats: data?.data ?? null,
    weeklySalesChange,
    weeklyOrdersChange,
    weeklyPendingOrdersChange,
    weeklyCancelledOrderChange,
    weeklyCustomersChange,
    weeklyNewCustomersChange,
    weeklyVisitsChange,
    countrySalesGrowth,
    isFetching,
  };
};
