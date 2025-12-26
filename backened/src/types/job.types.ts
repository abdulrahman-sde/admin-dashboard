export interface AggregationResult {
  totalOrders: number;
  totalSales: number;
  completedOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  totalVisits: number;
  uniqueVisits: number;
  totalPageViews: number;
  conversionRate: number;
  completedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  newOrders: number;
  averageOrderValue: number;
}

export interface RawOrderMetrics {
  totalOrders?: number;
  totalSales?: number;
  completedOrders?: number;
  cancelledOrders?: number;
  pendingOrders?: number;
  processingOrders?: number;
  shippedOrders?: number;
  newOrders?: number;
  returningCustomers?: number;
}

export interface RawProductMetrics {
  totalProducts?: number;
  inStockProducts?: number;
  outOfStockProducts?: number;
}

export interface RawSessionMetrics {
  totalVisits?: number;
  uniqueVisits?: number;
}

export interface RawTransactionMetrics {
  completedTransactions?: number;
  pendingTransactions?: number;
  failedTransactions?: number;
}
