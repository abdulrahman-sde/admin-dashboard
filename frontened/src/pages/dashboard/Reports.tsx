import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CustomerGrowth } from "@/components/dashboard/reports/CustomerGrowth";
import {
  customerGrowthData,
  keyMetricsData,
  salesGoalData,
  conversionRateData,
  avgOrderValueData,
  visitsByDeviceData,
  onlineSessionsData,
  topCustomersData,
  topProductsData,
} from "@/constants/reportsData";
import { KeyMetricCard } from "@/components/dashboard/reports/KeyMetricCard";
import { SalesGoal } from "@/components/dashboard/reports/SalesGoal";
import { ConversionRate } from "../../components/dashboard/reports/ConversionRate";
import { AvgOrderValue } from "@/components/dashboard/reports/AvgOrderValue";
import { CustomerDemographics } from "@/components/dashboard/reports/CustomerDemographics";
import { VisitsByDevice } from "@/components/dashboard/reports/VisitsByDevice";
import { OnlineSessions } from "@/components/dashboard/reports/OnlineSessions";
import { TopCustomers } from "@/components/dashboard/reports/TopCustomers";
import { TopProducts } from "@/components/dashboard/reports/TopProducts";

export default function Reports() {
  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <Button className="bg-[#4EA674] hover:bg-[#3d8b5e] text-white gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Customer Growth Chart */}
      <div className="w-full h-[400px]">
        <CustomerGrowth data={customerGrowthData} />
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KeyMetricCard
          title="Existing Users"
          value={keyMetricsData.existingUsers.value}
          change={keyMetricsData.existingUsers.change}
          isPositive={keyMetricsData.existingUsers.isPositive}
        />
        <KeyMetricCard
          title="New Users"
          value={keyMetricsData.newUsers.value}
          change={keyMetricsData.newUsers.change}
          isPositive={keyMetricsData.newUsers.isPositive}
        />
        <KeyMetricCard
          title="Total Visits"
          value={keyMetricsData.totalVisits.value}
          change={keyMetricsData.totalVisits.change}
          isPositive={keyMetricsData.totalVisits.isPositive}
        />
        <KeyMetricCard
          title="Unique Visits"
          value={keyMetricsData.uniqueVisits.value}
          change={keyMetricsData.uniqueVisits.change}
          isPositive={keyMetricsData.uniqueVisits.isPositive}
        />
      </div>

      {/* Middle Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SalesGoal data={salesGoalData} />
        <ConversionRate data={conversionRateData} />
        <AvgOrderValue data={avgOrderValueData} />
      </div>

      {/* Map & Device Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CustomerDemographics />
        </div>
        <div className="space-y-4">
          <VisitsByDevice data={visitsByDeviceData} />
          <OnlineSessions data={onlineSessionsData} />
        </div>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopCustomers data={topCustomersData} />
        <TopProducts data={topProductsData} />
      </div>
    </div>
  );
}
