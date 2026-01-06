export interface MetricItem {
  value: string;
  change: number;
  isPositive: boolean;
}

export interface ReportsData {
  customerGrowthData: {
    month: string;
    newCustomers: number;
    returningCustomers: number;
  }[];
  keyMetrics: {
    existingUsers: MetricItem;
    newUsers: MetricItem;
    totalVisits: MetricItem;
    uniqueVisits: MetricItem;
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
    trend: { time: string; value: number }[];
  };
}

export interface DemographicData {
  totalCustomers: number;
  demographics: { country: string; sales: number }[];
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  orders: number;
  spent: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image?: string;
  images?: string[];
  clicks: number;
  unitsSold: number;
  category: string;
  stock?: number;
}

export interface ActiveSessions {
  activeUsers: number;
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
}

export interface DeviceAnalytics {
  devices: { device: string; count: number; percentage: number }[];
  total: number;
}

export interface ReportsQueryParams {
  startDate?: string;
  endDate?: string;
}
