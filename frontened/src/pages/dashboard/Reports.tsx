import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetReportsDataQuery } from "@/lib/store/services/reportsApi";

import { CustomerGrowthChart } from "@/components/dashboard/reports/CustomerGrowthChart";
import { KeyMetricCard } from "@/components/dashboard/reports/KeyMetricCard";
import { SalesGoalChart } from "@/components/dashboard/reports/SalesGoalChart";
import { ConversionRateChart } from "@/components/dashboard/reports/ConversionRateChart";
import { AverageOrderValueChart } from "@/components/dashboard/reports/AverageOrderValueChart";
import CustomerDemographicsMap from "@/components/dashboard/reports/CustomerDemographicsMap";
import VisitsByDevice from "@/components/dashboard/reports/VisitsByDevice";
import ActiveSessionsCard from "@/components/dashboard/reports/ActiveSessionsCard";
import TopCustomers from "@/components/dashboard/reports/TopCustomers";
import TopProducts from "@/components/dashboard/reports/TopProducts";

export default function Reports() {
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    // Default to current month view or last 30 days
    start.setDate(1); // Start of month
    // Actually the user wants "current month only" for the second pic data
    // But for "Customer Growth" chart it probably needs historical data (last 12 months)
    // The backend logic handles "Customer Growth" by grouping all available data if needed, or we fetch a wider range.
    // The `getReportsData` endpoint filters by range provided.
    // Let's ask for the last 12 months to get good historical context for the charts.
    start.setFullYear(end.getFullYear() - 1);
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  }, []);

  const { data: reportsData, isLoading } = useGetReportsDataQuery(dateRange);

  if (isLoading) {
    return (
      <div className="bg-[#F8F9FB] -m-4 sm:-m-6 p-4 sm:p-10 space-y-8 min-h-screen">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <Skeleton className="h-[350px] w-full rounded-xl" />
        </div>

        <div className="bg-white border border-[#F1F3F9] rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Fallback data structure if reportsData is empty/undefined (should handle in components too)
  const {
    customerGrowthData = [],
    keyMetrics = {
      existingUsers: { value: "0", change: 0, isPositive: true },
      newUsers: { value: "0", change: 0, isPositive: true },
      totalVisits: { value: "0", change: 0, isPositive: true },
      uniqueVisits: { value: "0", change: 0, isPositive: true },
    },
    salesGoal = { percentage: 0, soldFor: 0, monthGoal: 0, left: 0 },
    conversionRate = { percentage: 0, cart: 0, checkout: 0, purchase: 0 },
    avgOrderValue = { thisMonth: 0, prevMonth: 0, trend: [] },
  } = reportsData || {};

  return (
    <div className="bg-[#F8F9FB] -m-4 sm:-m-6 p-4 sm:p-10 space-y-8 min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
        <Button className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2 rounded-lg gap-2 font-medium cursor-pointer">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Customer Growth Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
        <CustomerGrowthChart data={customerGrowthData} />
      </div>

      {/* Key Metrics Row */}
      <div className="bg-white border border-[#F1F3F9] rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <KeyMetricCard
            title="Existing Users"
            value={keyMetrics.existingUsers.value}
            change={keyMetrics.existingUsers.change}
            isPositive={keyMetrics.existingUsers.isPositive}
            className="sm:pr-6"
          />
          <KeyMetricCard
            title="New Users"
            value={keyMetrics.newUsers.value}
            change={keyMetrics.newUsers.change}
            isPositive={keyMetrics.newUsers.isPositive}
            className="sm:px-6 pt-4 sm:pt-0"
          />
          <KeyMetricCard
            title="Total Visits"
            value={keyMetrics.totalVisits.value}
            change={keyMetrics.totalVisits.change}
            isPositive={keyMetrics.totalVisits.isPositive}
            className="sm:px-6 pt-4 sm:pt-0"
          />
          <KeyMetricCard
            title="Unique Visits"
            value={keyMetrics.uniqueVisits.value}
            change={keyMetrics.uniqueVisits.change}
            isPositive={keyMetrics.uniqueVisits.isPositive}
            className="sm:pl-6 pt-4 sm:pt-0"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <SalesGoalChart data={salesGoal} />
        </div>
        <div className="lg:col-span-3">
          <ConversionRateChart data={conversionRate} />
        </div>
        <div className="lg:col-span-6">
          <AverageOrderValueChart data={avgOrderValue} />
        </div>
      </div>

      {/* Demographics & Devices */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-9">
          <CustomerDemographicsMap />
        </div>
        <div className="xl:col-span-3 flex flex-col gap-6">
          <VisitsByDevice />
          <ActiveSessionsCard />
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
        <TopCustomers />
        <TopProducts />
      </div>
    </div>
  );
}
