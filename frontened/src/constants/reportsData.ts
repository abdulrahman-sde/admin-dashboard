export const customerGrowthData = [
  { month: "Jan", returning: 450, new: 350 },
  { month: "Feb", returning: 380, new: 260 },
  { month: "Mar", returning: 350, new: 180 },
  { month: "Apr", returning: 420, new: 280 },
  { month: "May", returning: 460, new: 210 },
  { month: "Jun", returning: 360, new: 260 },
  { month: "Jul", returning: 410, new: 200 },
  { month: "Aug", returning: 430, new: 160 },
  { month: "Sep", returning: 440, new: 200 },
  { month: "Oct", returning: 400, new: 260 },
  { month: "Nov", returning: 430, new: 160 },
  { month: "Dec", returning: 430, new: 120 },
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
    image: "/placeholder-tshirt.png",
    clicks: "12.040",
    unitsSold: 195,
  },
  {
    id: 2,
    name: "Women White T-Shirt",
    image: "/placeholder-tshirt-w.png",
    clicks: "11.234",
    unitsSold: 146,
  },
  {
    id: 3,
    name: "Women Striped T-Shirt",
    image: "/placeholder-striped.png",
    clicks: "10.054",
    unitsSold: 122,
  },
  {
    id: 4,
    name: "Men Grey Hoodie",
    image: "/placeholder-hoodie.png",
    clicks: "8.405",
    unitsSold: 110,
  },
  {
    id: 5,
    name: "Women Red T-Shirt",
    image: "/placeholder-red.png",
    clicks: "5.600",
    unitsSold: 87,
  },
];
