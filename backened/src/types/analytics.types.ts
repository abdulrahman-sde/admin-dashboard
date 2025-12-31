import type { Product } from "@prisma/client";

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

export interface CustomerOverviewMetric {
  day: string;
  activeCustomers: number;
  repeatCustomers: number;
  shopVisitor: number;
}

export interface ReportMetric {
  day: string;
  conversionRate: number;
  customers: number;
  totalProducts: number;
  stockProducts: number;
  outOfStock: number;
  revenue: number;
}

export interface DetailedDailyMetricsResponse {
  customerOverview: {
    thisWeek: CustomerOverviewMetric[];
    lastWeek: CustomerOverviewMetric[];
  };
  report: {
    thisWeek: ReportMetric[];
    lastWeek: ReportMetric[];
  };
}
