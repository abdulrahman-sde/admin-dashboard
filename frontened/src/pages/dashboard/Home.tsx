import { StatsCard } from "@/components/dashboard/home/HomeStatsCard";
import WeeklyReport from "@/components/dashboard/home/WeeklyReport";
import CountryWiseSales from "@/components/dashboard/home/CountryWiseSales";
import RecentTransactions from "@/components/dashboard/home/RecentTransactions";
import TopProducts from "@/components/dashboard/home/TopProducts";
import BestSellingProduct from "@/components/dashboard/home/BestSellingProduct";
import AddNewProduct from "@/components/dashboard/home/AddNewProduct";
import { countrySalesData } from "@/constants/constants";
import { useGetAnalytics } from "@/hooks/analytics/useGetAnalytics";

export default function DashboardHome() {
  const {
    stats,
    weeklySalesChange,
    weeklyOrdersChange,
    weeklyCancelledOrderChange,
    isFetching,
  } = useGetAnalytics();

  // Map analytics products to component formats
  const topProductsFormatted = stats?.products?.topProducts
    ?.slice(0, 4)
    .map((p) => ({
      name: p.name,
      itemCode: p.sku || p.id.slice(-6).toUpperCase(),
      price: p.price,
      image: p.thumbnail || p.images[0] || "",
    }));

  const bestSellingProductsFormatted = stats?.products?.topProducts
    ?.slice(0, 5)
    .map((p) => ({
      name: p.name,
      totalOrder: p.totalSales || 0,
      status: p.stockQuantity > 0 ? "Stock" : "Out of Stock",
      price: p.price,
      image: p.thumbnail || p.images[0] || "",
    }));

  // Build dynamic weekly report data from analytics
  const weeklyReportData = {
    thisWeek: {
      stats: {
        customers: stats?.customers?.thisWeek?.totalCustomers ?? 0,
        totalProducts: stats?.products?.thisWeek?.totalProducts ?? 0,
        stockProducts: stats?.products?.thisWeek?.inStockProducts ?? 0,
        outOfStock: stats?.products?.thisWeek?.outOfStockProducts ?? 0,
        revenue: stats?.orders?.thisWeek?.totalSales ?? 0,
      },
      chartData: {
        customers: [
          {
            day: "Sun",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
          {
            day: "Mon",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
          {
            day: "Tue",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
          {
            day: "Wed",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
          {
            day: "Thu",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
          {
            day: "Fri",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
          {
            day: "Sat",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
        ],
        totalProducts: [
          { day: "Sun", value: stats?.products?.thisWeek?.totalProducts ?? 0 },
          { day: "Mon", value: stats?.products?.thisWeek?.totalProducts ?? 0 },
          { day: "Tue", value: stats?.products?.thisWeek?.totalProducts ?? 0 },
          { day: "Wed", value: stats?.products?.thisWeek?.totalProducts ?? 0 },
          { day: "Thu", value: stats?.products?.thisWeek?.totalProducts ?? 0 },
          { day: "Fri", value: stats?.products?.thisWeek?.totalProducts ?? 0 },
          { day: "Sat", value: stats?.products?.thisWeek?.totalProducts ?? 0 },
        ],
        stockProducts: [
          {
            day: "Sun",
            value: stats?.products?.thisWeek?.inStockProducts ?? 0,
          },
          {
            day: "Mon",
            value: stats?.products?.thisWeek?.inStockProducts ?? 0,
          },
          {
            day: "Tue",
            value: stats?.products?.thisWeek?.inStockProducts ?? 0,
          },
          {
            day: "Wed",
            value: stats?.products?.thisWeek?.inStockProducts ?? 0,
          },
          {
            day: "Thu",
            value: stats?.products?.thisWeek?.inStockProducts ?? 0,
          },
          {
            day: "Fri",
            value: stats?.products?.thisWeek?.inStockProducts ?? 0,
          },
          {
            day: "Sat",
            value: stats?.products?.thisWeek?.inStockProducts ?? 0,
          },
        ],
        outOfStock: [
          {
            day: "Sun",
            value: stats?.products?.thisWeek?.outOfStockProducts ?? 0,
          },
          {
            day: "Mon",
            value: stats?.products?.thisWeek?.outOfStockProducts ?? 0,
          },
          {
            day: "Tue",
            value: stats?.products?.thisWeek?.outOfStockProducts ?? 0,
          },
          {
            day: "Wed",
            value: stats?.products?.thisWeek?.outOfStockProducts ?? 0,
          },
          {
            day: "Thu",
            value: stats?.products?.thisWeek?.outOfStockProducts ?? 0,
          },
          {
            day: "Fri",
            value: stats?.products?.thisWeek?.outOfStockProducts ?? 0,
          },
          {
            day: "Sat",
            value: stats?.products?.thisWeek?.outOfStockProducts ?? 0,
          },
        ],
        revenue: [
          {
            day: "Sun",
            value: Math.round((stats?.orders?.thisWeek?.totalSales ?? 0) / 7),
          },
          {
            day: "Mon",
            value: Math.round((stats?.orders?.thisWeek?.totalSales ?? 0) / 7),
          },
          {
            day: "Tue",
            value: Math.round((stats?.orders?.thisWeek?.totalSales ?? 0) / 7),
          },
          {
            day: "Wed",
            value: Math.round((stats?.orders?.thisWeek?.totalSales ?? 0) / 7),
          },
          {
            day: "Thu",
            value: Math.round((stats?.orders?.thisWeek?.totalSales ?? 0) / 7),
          },
          {
            day: "Fri",
            value: Math.round((stats?.orders?.thisWeek?.totalSales ?? 0) / 7),
          },
          {
            day: "Sat",
            value: Math.round((stats?.orders?.thisWeek?.totalSales ?? 0) / 7),
          },
        ],
      },
    },
    lastWeek: {
      stats: {
        customers: stats?.customers?.previousWeek?.totalCustomers ?? 0,
        totalProducts: stats?.products?.previousWeek?.totalProducts ?? 0,
        stockProducts: stats?.products?.previousWeek?.inStockProducts ?? 0,
        outOfStock: stats?.products?.previousWeek?.outOfStockProducts ?? 0,
        revenue: stats?.orders?.previousWeek?.totalSales ?? 0,
      },
      chartData: {
        customers: [
          {
            day: "Sun",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
          {
            day: "Mon",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
          {
            day: "Tue",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
          {
            day: "Wed",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
          {
            day: "Thu",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
          {
            day: "Fri",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
          {
            day: "Sat",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
        ],
        totalProducts: [
          {
            day: "Sun",
            value: stats?.products?.previousWeek?.totalProducts ?? 0,
          },
          {
            day: "Mon",
            value: stats?.products?.previousWeek?.totalProducts ?? 0,
          },
          {
            day: "Tue",
            value: stats?.products?.previousWeek?.totalProducts ?? 0,
          },
          {
            day: "Wed",
            value: stats?.products?.previousWeek?.totalProducts ?? 0,
          },
          {
            day: "Thu",
            value: stats?.products?.previousWeek?.totalProducts ?? 0,
          },
          {
            day: "Fri",
            value: stats?.products?.previousWeek?.totalProducts ?? 0,
          },
          {
            day: "Sat",
            value: stats?.products?.previousWeek?.totalProducts ?? 0,
          },
        ],
        stockProducts: [
          {
            day: "Sun",
            value: stats?.products?.previousWeek?.inStockProducts ?? 0,
          },
          {
            day: "Mon",
            value: stats?.products?.previousWeek?.inStockProducts ?? 0,
          },
          {
            day: "Tue",
            value: stats?.products?.previousWeek?.inStockProducts ?? 0,
          },
          {
            day: "Wed",
            value: stats?.products?.previousWeek?.inStockProducts ?? 0,
          },
          {
            day: "Thu",
            value: stats?.products?.previousWeek?.inStockProducts ?? 0,
          },
          {
            day: "Fri",
            value: stats?.products?.previousWeek?.inStockProducts ?? 0,
          },
          {
            day: "Sat",
            value: stats?.products?.previousWeek?.inStockProducts ?? 0,
          },
        ],
        outOfStock: [
          {
            day: "Sun",
            value: stats?.products?.previousWeek?.outOfStockProducts ?? 0,
          },
          {
            day: "Mon",
            value: stats?.products?.previousWeek?.outOfStockProducts ?? 0,
          },
          {
            day: "Tue",
            value: stats?.products?.previousWeek?.outOfStockProducts ?? 0,
          },
          {
            day: "Wed",
            value: stats?.products?.previousWeek?.outOfStockProducts ?? 0,
          },
          {
            day: "Thu",
            value: stats?.products?.previousWeek?.outOfStockProducts ?? 0,
          },
          {
            day: "Fri",
            value: stats?.products?.previousWeek?.outOfStockProducts ?? 0,
          },
          {
            day: "Sat",
            value: stats?.products?.previousWeek?.outOfStockProducts ?? 0,
          },
        ],
        revenue: [
          {
            day: "Sun",
            value: Math.round(
              (stats?.orders?.previousWeek?.totalSales ?? 0) / 7
            ),
          },
          {
            day: "Mon",
            value: Math.round(
              (stats?.orders?.previousWeek?.totalSales ?? 0) / 7
            ),
          },
          {
            day: "Tue",
            value: Math.round(
              (stats?.orders?.previousWeek?.totalSales ?? 0) / 7
            ),
          },
          {
            day: "Wed",
            value: Math.round(
              (stats?.orders?.previousWeek?.totalSales ?? 0) / 7
            ),
          },
          {
            day: "Thu",
            value: Math.round(
              (stats?.orders?.previousWeek?.totalSales ?? 0) / 7
            ),
          },
          {
            day: "Fri",
            value: Math.round(
              (stats?.orders?.previousWeek?.totalSales ?? 0) / 7
            ),
          },
          {
            day: "Sat",
            value: Math.round(
              (stats?.orders?.previousWeek?.totalSales ?? 0) / 7
            ),
          },
        ],
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <StatsCard
          title="Total Sales"
          value={stats?.orders?.thisWeek?.totalSales}
          label="Sales"
          change={{
            value: Math.abs(weeklySalesChange),
            isPositive: weeklySalesChange > 0,
          }}
          previousValue={stats?.orders?.previousWeek?.totalSales}
          isLoading={isFetching}
          className="shadow-sm border-0 "
        />
        <StatsCard
          title="Total Orders"
          value={stats?.orders?.thisWeek?.totalOrders}
          label="order"
          change={{
            value: Math.abs(weeklyOrdersChange),
            isPositive: weeklyOrdersChange > 0,
          }}
          previousValue={stats?.orders?.previousWeek?.totalOrders}
          isLoading={isFetching}
          className="shadow-sm border-0 "
        />
        <StatsCard
          title="Pending & Canceled"
          variant="split"
          isLoading={isFetching}
          splitData={{
            left: {
              label: "Pending",
              value: stats?.orders?.thisWeek?.pendingOrders ?? 0,
              subValue: `user ${stats?.customers?.thisWeek?.newCustomers ?? 0}`,
            },
            right: {
              label: "Canceled",
              value: stats?.orders?.thisWeek?.cancelledOrders ?? 0,
              change: {
                value: Math.abs(weeklyCancelledOrderChange),
                isPositive: weeklyCancelledOrderChange > 0,
              },
            },
          }}
          className="shadow-sm border-0 "
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <div className="col-span-3 xl:col-span-2 ">
          <WeeklyReport data={weeklyReportData} />
        </div>
        <div className="col-span-3  xl:col-span-1">
          <CountryWiseSales data={countrySalesData} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4 mt-5">
        <div className="col-span-1 xl:col-span-5">
          <RecentTransactions />
        </div>
        <div className="col-span-1 xl:col-span-2">
          <TopProducts data={topProductsFormatted} isLoading={isFetching} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <div className="col-span-3 xl:col-span-2">
          <BestSellingProduct
            data={bestSellingProductsFormatted}
            isLoading={isFetching}
          />
        </div>
        <div className="col-span-3 xl:col-span-1">
          <AddNewProduct />
        </div>
      </div>
    </div>
  );
}
