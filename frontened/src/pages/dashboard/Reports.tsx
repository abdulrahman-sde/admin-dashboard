import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CustomerGrowth } from "@/components/dashboard/reports/CustomerGrowth";
import { KeyMetricCard } from "@/components/dashboard/reports/KeyMetricCard";
import { SalesGoal } from "@/components/dashboard/reports/SalesGoal";
import { ConversionRate } from "@/components/dashboard/reports/ConversionRate";
import { AvgOrderValue } from "@/components/dashboard/reports/AvgOrderValue";
import { CustomerDemographics } from "@/components/dashboard/reports/CustomerDemographics";
import { VisitsByDevice } from "@/components/dashboard/reports/VisitsByDevice";
import { OnlineSessions } from "@/components/dashboard/reports/OnlineSessions";
import { TopCustomers } from "@/components/dashboard/reports/TopCustomers";
import { TopProducts } from "@/components/dashboard/reports/TopProducts";
import { useGetReportsQuery } from "@/lib/store/services/analytics/analyticsApi";
import { Skeleton } from "@/components/ui/skeleton";

const MOCK_DATA = {
  visitsByDevice: [
    { device: "Mobile", percentage: 62 },
    { device: "Laptop", percentage: 20 },
    { device: "Tablet", percentage: 13 },
    { device: "Other", percentage: 5 },
  ],
  onlineSessions: { value: 128, isPositive: true },
  topCustomers: [
    {
      id: "1",
      name: "Lee Henry",
      avatar: null,
      orders: 52,
      spent: 969.37,
    },
    {
      id: "2",
      name: "Myrtie McBride",
      avatar: null,
      orders: 43,
      spent: 909.54,
    },
    {
      id: "3",
      name: "Tommy Walker",
      avatar: null,
      orders: 41,
      spent: 728.9,
    },
    {
      id: "4",
      name: "Lela Cannon",
      avatar: null,
      orders: 38,
      spent: 679.42,
    },
    {
      id: "5",
      name: "Jimmy Cook",
      avatar: null,
      orders: 34,
      spent: 549.71,
    },
  ],
  topProducts: [
    {
      id: "1",
      name: "Men White T-Shirt",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      clicks: "12.040",
      unitsSold: 195,
    },
    {
      id: "2",
      name: "Women White T-Shirt",
      image:
        "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80",
      clicks: "11.234",
      unitsSold: 146,
    },
    {
      id: "3",
      name: "Women Striped T-Shirt",
      image:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
      clicks: "10.054",
      unitsSold: 122,
    },
    {
      id: "4",
      name: "Men Grey Hoodie",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      clicks: "8.405",
      unitsSold: 110,
    },
    {
      id: "5",
      name: "Women Red T-Shirt",
      image:
        "https://images.unsplash.com/photo-1583743814966-893003b41315?w=800&q=80",
      clicks: "5.600",
      unitsSold: 87,
    },
  ],
};

export default function Reports() {
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  }, []);

  const { data: response, isLoading } = useGetReportsQuery(dateRange);
  const reportsData = response?.data;

  if (isLoading) {
    return (
      <div className="bg-[#F8F9FB] -m-4 sm:-m-6 p-4 sm:p-10 space-y-8 min-h-screen">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        {/* Customer Growth Skeleton */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
          <Skeleton className="h-[350px] w-full rounded-xl" />
        </div>

        {/* Key Metrics Skeleton */}
        <div className="bg-white border border-[#F1F3F9] rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-0">
            <div className="sm:pr-6 sm:border-r border-gray-50 flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="sm:pl-6 lg:pr-6 lg:border-r border-gray-50 flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="sm:pr-6 sm:border-r border-gray-50 lg:pl-6 flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="sm:pl-6 flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>

        {/* Goals and AOV Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-3">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-6">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const {
    customerGrowthData,
    keyMetrics,
    salesGoal,
    conversionRate,
    avgOrderValue,
  } = reportsData || {
    customerGrowthData: [],
    keyMetrics: {
      existingUsers: { value: "0", change: 0, isPositive: true },
      newUsers: { value: "0", change: 0, isPositive: true },
      totalVisits: { value: "0", change: 0, isPositive: true },
      uniqueVisits: { value: "0", change: 0, isPositive: true },
    },
    salesGoal: { percentage: 0, soldFor: 0, monthGoal: 0, left: 0 },
    conversionRate: { percentage: 0, cart: 0, checkout: 0, purchase: 0 },
    avgOrderValue: { thisMonth: 0, prevMonth: 0, trend: [] },
  };

  return (
    <div className="bg-[#F8F9FB] -m-4 sm:-m-6 p-4 sm:p-10 space-y-8 min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
        <Button className="bg-[#4EA674] hover:bg-[#3d8b5e] text-white px-6 py-2 rounded-lg gap-2 font-medium">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Customer Growth Section */}
      <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        <CustomerGrowth data={customerGrowthData} />
      </div>

      {/* Key Metrics Row - Grouped in one container with dividers */}
      <div className="bg-white border border-[#F1F3F9] rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-0">
          <KeyMetricCard
            title="Existing Users"
            value={keyMetrics.existingUsers.value}
            change={keyMetrics.existingUsers.change}
            isPositive={keyMetrics.existingUsers.isPositive}
            className="sm:pr-6 sm:border-r border-gray-50"
          />
          <KeyMetricCard
            title="New Users"
            value={keyMetrics.newUsers.value}
            change={keyMetrics.newUsers.change}
            isPositive={keyMetrics.newUsers.isPositive}
            className="sm:pl-6 lg:pr-6 lg:border-r border-gray-50"
          />
          <KeyMetricCard
            title="Total Visits"
            value={keyMetrics.totalVisits.value}
            change={keyMetrics.totalVisits.change}
            isPositive={keyMetrics.totalVisits.isPositive}
            className="sm:pr-6 sm:border-r border-gray-50 lg:pl-6"
          />
          <KeyMetricCard
            title="Unique Visits"
            value={keyMetrics.uniqueVisits.value}
            change={keyMetrics.uniqueVisits.change}
            isPositive={keyMetrics.uniqueVisits.isPositive}
            className="sm:pl-6"
          />
        </div>
      </div>

      {/* Goals and AOV Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <SalesGoal data={salesGoal} />
        </div>
        <div className="lg:col-span-3">
          <ConversionRate data={conversionRate} />
        </div>
        <div className="lg:col-span-6">
          <AvgOrderValue data={avgOrderValue} />
        </div>
      </div>

      {/* Demographics and Devices Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <CustomerDemographics />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <VisitsByDevice data={MOCK_DATA.visitsByDevice} />
          <OnlineSessions data={MOCK_DATA.onlineSessions} />
        </div>
      </div>

      {/* Top Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <TopCustomers data={MOCK_DATA.topCustomers} />
        <TopProducts data={MOCK_DATA.topProducts} />
      </div>
    </div>
  );
}
