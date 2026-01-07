import { useState, useMemo } from "react";
import { useGetReportsDataQuery } from "@/lib/store/services/reportsApi";
import type { ReportsData } from "@/types/reports";

export function useReports() {
  const [timeRange, setTimeRange] = useState("12_months");

  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(1); // Start of month

    const monthsToSubtract =
      timeRange === "6_months" ? 6 : timeRange === "9_months" ? 9 : 12;
    start.setMonth(end.getMonth() - monthsToSubtract);

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  }, [timeRange]);

  const { data: reportsData, isLoading } = useGetReportsDataQuery(dateRange);

  const {
    customerGrowthData = [],
    keyMetrics = {
      returningUsers: { value: "0", change: 0, isPositive: true },
      newUsers: { value: "0", change: 0, isPositive: true },
      totalVisits: { value: "0", change: 0, isPositive: true },
      uniqueVisits: { value: "0", change: 0, isPositive: true },
    },
    salesGoal = { percentage: 0, soldFor: 0, monthGoal: 0, left: 0 },
    conversionRate = { percentage: 0, cart: 0, checkout: 0, purchase: 0 },
    avgOrderValue = { thisMonth: 0, prevMonth: 0, trend: [] },
  } = reportsData || ({} as ReportsData);

  const handleExport = () => {
    if (!reportsData) return;

    const exportSections: (string | number)[][] = [];

    exportSections.push(["Customer Growth"]);
    exportSections.push(["Month", "Returning Customers", "New Customers"]);
    customerGrowthData.forEach(
      (d: {
        month: string;
        returningCustomers: number;
        newCustomers: number;
      }) => {
        exportSections.push([d.month, d.returningCustomers, d.newCustomers]);
      }
    );
    exportSections.push([]);

    exportSections.push(["Key Metrics"]);
    exportSections.push(["Metric", "Value", "Change %"]);
    exportSections.push([
      "Returning Users",
      keyMetrics.returningUsers.value,
      keyMetrics.returningUsers.change,
    ]);
    exportSections.push([
      "New Users",
      keyMetrics.newUsers.value,
      keyMetrics.newUsers.change,
    ]);
    exportSections.push([
      "Total Visits",
      keyMetrics.totalVisits.value,
      keyMetrics.totalVisits.change,
    ]);
    exportSections.push([
      "Unique Visits",
      keyMetrics.uniqueVisits.value,
      keyMetrics.uniqueVisits.change,
    ]);
    exportSections.push([]);

    exportSections.push(["Conversion & Sales Goals"]);
    exportSections.push(["Goal Progress %", salesGoal.percentage]);
    exportSections.push(["Sold For", salesGoal.soldFor]);
    exportSections.push(["Month Goal", salesGoal.monthGoal]);
    exportSections.push(["Conversion Rate %", conversionRate.percentage]);
    exportSections.push(["Cart %", conversionRate.cart]);
    exportSections.push(["Checkout %", conversionRate.checkout]);
    exportSections.push(["Purchase %", conversionRate.purchase]);

    const csvContent = exportSections.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `reports_full_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    timeRange,
    setTimeRange,
    isLoading,
    customerGrowthData,
    keyMetrics,
    salesGoal,
    conversionRate,
    avgOrderValue,
    handleExport,
  };
}
