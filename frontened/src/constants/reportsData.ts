export const customerGrowthData = [
  { month: "Jan", returningCustomers: 450, newCustomers: 350 },
  { month: "Feb", returningCustomers: 380, newCustomers: 260 },
  { month: "Mar", returningCustomers: 350, newCustomers: 180 },
  { month: "Apr", returningCustomers: 420, newCustomers: 280 },
  { month: "May", returningCustomers: 460, newCustomers: 210 },
  { month: "Jun", returningCustomers: 360, newCustomers: 260 },
  { month: "Jul", returningCustomers: 410, newCustomers: 200 },
  { month: "Aug", returningCustomers: 430, newCustomers: 160 },
  { month: "Sep", returningCustomers: 440, newCustomers: 200 },
  { month: "Oct", returningCustomers: 400, newCustomers: 260 },
  { month: "Nov", returningCustomers: 430, newCustomers: 160 },
  { month: "Dec", returningCustomers: 430, newCustomers: 120 },
];

export const keyMetricsData = {
  existingUsers: { value: "5.653", change: 22.45, isPositive: true },
  newUsers: { value: "1.650", change: 15.34, isPositive: true },
  totalVisits: { value: "9.504", change: -18.25, isPositive: false },
  uniqueVisits: { value: "5.423", change: -10.24, isPositive: false },
};

export const salesGoalData = {
  percentage: 75,
  soldFor: 15000,
  monthGoal: 20000,
  left: 5000,
};

export const conversionRateData = {
  percentage: 25,
  cart: 35,
  checkout: 29,
  purchase: 25,
};

export const avgOrderValueData = {
  thisMonth: 48.9,
  prevMonth: 48.9,
  trend: [
    { time: "4am", value: 50 },
    { time: "8am", value: 40 },
    { time: "12pm", value: 60 },
    { time: "4pm", value: 50 },
    { time: "8pm", value: 80 },
    { time: "Jun 12", value: 50 },
  ],
};

export const visitsByDeviceData = [
  { device: "Mobile", percentage: 62 },
  { device: "Laptop", percentage: 20 },
  { device: "Tablet", percentage: 13 },
  { device: "Other", percentage: 5 },
];

export const onlineSessionsData = {
  value: 128,
  isPositive: true,
};

export const topCustomersData = [
  {
    id: 1,
    name: "Lee Henry",
    avatar: "https://i.pravatar.cc/150?u=1",
    orders: 52,
    spent: 969.37,
  },
  {
    id: 2,
    name: "Myrtie McBride",
    avatar: "https://i.pravatar.cc/150?u=2",
    orders: 43,
    spent: 909.54,
    order: 2,
  },
  {
    id: 3,
    name: "Tommy Walker",
    avatar: "https://i.pravatar.cc/150?u=3",
    orders: 41,
    spent: 728.9,
  },
  {
    id: 4,
    name: "Lela Cannon",
    avatar: "https://i.pravatar.cc/150?u=4",
    orders: 38,
    spent: 679.42,
  },
  {
    id: 5,
    name: "Jimmy Cook",
    avatar: "https://i.pravatar.cc/150?u=5",
    orders: 34,
    spent: 549.71,
  },
];

export const topProductsData = [
  {
    id: 1,
    name: "Men White T-Shirt",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80",
    clicks: "12.040",
    unitsSold: 195,
  },
  {
    id: 2,
    name: "Wome White T-Shirt",
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100&q=80",
    clicks: "11.234",
    unitsSold: 146,
  },
  {
    id: 3,
    name: "Women Striped T-Shirt",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80",
    clicks: "10.054",
    unitsSold: 122,
  },
  {
    id: 4,
    name: "Men Grey Hoodie",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&q=80",
    clicks: "8.405",
    unitsSold: 110,
  },
  {
    id: 5,
    name: "Women Red T-Shirt",
    image:
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=100&q=80",
    clicks: "5.600",
    unitsSold: 87,
  },
];
