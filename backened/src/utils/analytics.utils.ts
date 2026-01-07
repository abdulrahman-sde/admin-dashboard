import type { DailyMetrics } from "@prisma/client";
import type {
  CustomerOverviewMetric,
  ReportMetric,
} from "../types/analytics.types.js";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const formatCustomerOverviewMetrics = (
  metrics: DailyMetrics[]
): CustomerOverviewMetric[] => {
  const formatted: CustomerOverviewMetric[] = daysOfWeek.map((day) => ({
    day,
    activeCustomers: 0,
    repeatCustomers: 0,
    shopVisitor: 0,
    conversionRate: 0,
  }));

  metrics.forEach((metric) => {
    const dayIndex = new Date(metric.date).getDay();
    formatted[dayIndex] = {
      day: daysOfWeek[dayIndex] || "",
      activeCustomers: metric.newCustomers + metric.returningCustomers,
      repeatCustomers: metric.returningCustomers,
      shopVisitor: metric.totalVisits,
      conversionRate: metric.conversionRate,
    };
  });

  return formatted;
};

export const formatReportMetrics = (
  metrics: DailyMetrics[]
): ReportMetric[] => {
  const formatted: ReportMetric[] = daysOfWeek.map((day) => ({
    day,
    conversionRate: 0,
    customers: 0,
    totalProducts: 0,
    stockProducts: 0,
    outOfStock: 0,
    revenue: 0,
  }));

  metrics.forEach((metric) => {
    const dayIndex = new Date(metric.date).getDay();
    formatted[dayIndex] = {
      day: daysOfWeek[dayIndex] || "",
      conversionRate: metric.conversionRate,
      customers: metric.newCustomers + metric.returningCustomers,
      totalProducts: metric.totalProducts,
      stockProducts: metric.inStockProducts,
      outOfStock: metric.outOfStockProducts,
      revenue: metric.totalSales,
    };
  });

  return formatted;
};
