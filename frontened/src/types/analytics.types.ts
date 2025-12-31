import type { Product } from "./products.types";
import type { ApiResponse } from "@/types/shared.types";

export interface DashboardWeeklyStats {
  orders: {
    thisWeek: WeeklyOrderStats;
    previousWeek: WeeklyOrderStats;
  };
  customers: {
    thisWeek: WeeklyCustomerStats;
    previousWeek: WeeklyCustomerStats;
  };
  transactions: {
    thisWeek: WeeklyTransactionStats;
    previousWeek: WeeklyTransactionStats;
  };
  products: {
    thisWeek: WeeklyProductStats;
    previousWeek: WeeklyProductStats;
    topProducts: Product[];
  };
}

export interface WeeklyOrderStats {
  totalOrders: number;
  totalSales: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  newOrders: number;
  averageOrderValue: number;
}

export interface WeeklyCustomerStats {
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
  totalVisits: number;
}

export interface WeeklyTransactionStats {
  completedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
}

export interface WeeklyProductStats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
}

export type GetAnalyticsResponse = ApiResponse<DashboardWeeklyStats>;

// Daily metrics returned from the backend
export interface DailyMetric {
  date: string; // ISO date
  totalVisits: number;
  uniqueVisits: number;
  totalPageViews: number;
  totalOrders: number;
  totalSales: number;
  conversionRate: number;
  cartRate?: number;
  checkoutRate?: number;
  purchaseRate?: number;
  totalProducts?: number;
  inStockProducts?: number;
  outOfStockProducts?: number;
}

export type GetDailyMetricsResponse = ApiResponse<{
  thisWeek: DailyMetric[];
  previousWeek: DailyMetric[];
}>;

export interface DailyMetricByDay {
  day: string; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
  activeCustomers: number;
  repeatCustomers: number;
  shopVisitor: number;
  conversionRate: number;
  customers: number;
  totalProducts: number;
  stockProducts: number;
  outOfStock: number;
  revenue: number;
}

export interface DetailedDailyMetrics {
  customerOverview: {
    thisWeek: DailyMetricByDay[];
    lastWeek: DailyMetricByDay[];
  };
  report: {
    thisWeek: DailyMetricByDay[];
    lastWeek: DailyMetricByDay[];
  };
}

export type GetDetailedDailyMetricsResponse = ApiResponse<DetailedDailyMetrics>;

export interface ReportsData {
  customerGrowthData: Array<{
    month: string;
    newCustomers: number;
    returningCustomers: number;
  }>;
  keyMetrics: {
    existingUsers: MetricWithChange;
    newUsers: MetricWithChange;
    totalVisits: MetricWithChange;
    uniqueVisits: MetricWithChange;
  };
  salesGoal: {
    percentage: number;
    soldFor: number;
    monthGoal: number;
    left: number;
  };
  conversionRate: {
    percentage: number;
    cart: number;
    checkout: number;
    purchase: number;
  };
  avgOrderValue: {
    thisMonth: number;
    prevMonth: number;
    trend: Array<{ time: string; value: number }>;
  };
  visitsByDevice: Array<{ device: string; percentage: number }>;
  onlineSessions: { value: number; isPositive: boolean };
  topCustomers: Array<{
    id: string;
    name: string;
    avatar: string | null;
    orders: number;
    spent: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    image: string;
    clicks: string;
    unitsSold: number;
  }>;
}

interface MetricWithChange {
  value: string;
  change: number;
  isPositive: boolean;
}

export type GetReportsResponse = ApiResponse<ReportsData>;
