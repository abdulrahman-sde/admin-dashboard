import { StatsCard } from "@/components/dashboard/home/HomeStatsCard";
import WeeklyReport from "@/components/dashboard/home/WeeklyReport";
import CountryWiseSales from "@/components/dashboard/home/CountryWiseSales";
import RecentTransactions from "@/components/dashboard/home/RecentTransactions";
import TopProducts from "@/components/dashboard/home/TopProducts";
import BestSellingProduct from "@/components/dashboard/home/BestSellingProduct";
import AddNewProduct from "@/components/dashboard/home/AddNewProduct";
import { countrySalesData } from "@/constants/constants";
import { useDashboardHome } from "@/hooks/dashboard/useDashboardHome";

export default function DashboardHome() {
  const {
    stats,
    weeklySalesChange,
    weeklyOrdersChange,
    weeklyCancelledOrderChange,
    isFetching,
    topProductsFormatted,
    bestSellingProductsFormatted,
  } = useDashboardHome();

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
          <WeeklyReport />
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
