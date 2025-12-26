export const siteHeaderHeadings = {
  dashboard: "Dashboard",
  orders: "Order Management",
  customers: "Customers",
  coupons: "Coupon",
  categories: "Categories",
  transactions: "Transaction",
  reports: "Reports",
  addProducts: "Add Products",
  products: "Product List",
  admin: "Admin role",
};

// Dashboard Stats Data
export const dashboardStats = [
  {
    title: "Total Sales",
    subtitle: "Last 7 days",
    value: "$350K",
    label: "Sales",
    change: { value: "10.4%", isPositive: true },
    previousValue: "$235",
    showDetailsButton: true,
  },
  {
    title: "Total Orders",
    subtitle: "Last 7 days",
    value: "1,240",
    label: "Orders",
    previousValue: "1,100",
    change: { value: "14.4%", isPositive: true },
  },
  {
    title: "Total Customers",
    subtitle: "Last 7 days",
    value: "8,549",
    label: "Customers",
    previousValue: "7,890",
    change: { value: "8.3%", isPositive: true },
  },
];

// Recent Orders Data
export const recentOrders = [
  {
    id: "12345",
    customer: "John Doe",
    product: "Laptop Pro 15",
    amount: "$1,299",
    status: "Completed",
    date: "Dec 1, 2025",
  },
  {
    id: "12346",
    customer: "Jane Smith",
    product: "Wireless Mouse",
    amount: "$29",
    status: "Pending",
    date: "Dec 2, 2025",
  },
  {
    id: "12347",
    customer: "Bob Johnson",
    product: "USB-C Cable",
    amount: "$15",
    status: "Completed",
    date: "Dec 2, 2025",
  },
  {
    id: "12348",
    customer: "Alice Williams",
    product: "Mechanical Keyboard",
    amount: "$149",
    status: "Processing",
    date: "Dec 3, 2025",
  },
  {
    id: "12349",
    customer: "Charlie Brown",
    product: "Monitor 27inch",
    amount: "$399",
    status: "Completed",
    date: "Dec 3, 2025",
  },
];

// Top Products Data
export const topProducts = [
  {
    id: 1,
    name: "Laptop Pro 15",
    category: "Electronics",
    sales: 156,
    revenue: "$202,644",
    stock: 24,
  },
  {
    id: 2,
    name: "Wireless Mouse",
    category: "Accessories",
    sales: 423,
    revenue: "$12,267",
    stock: 156,
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    category: "Accessories",
    sales: 287,
    revenue: "$42,763",
    stock: 89,
  },
  {
    id: 4,
    name: "Monitor 27inch",
    category: "Electronics",
    sales: 198,
    revenue: "$79,002",
    stock: 45,
  },
  {
    id: 5,
    name: "USB-C Cable",
    category: "Accessories",
    sales: 891,
    revenue: "$13,365",
    stock: 234,
  },
];

// Customer Data
export const customersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    totalOrders: 12,
    totalSpent: "$2,450",
    status: "Active",
    joinDate: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    totalOrders: 8,
    totalSpent: "$1,890",
    status: "Active",
    joinDate: "Feb 20, 2024",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    totalOrders: 5,
    totalSpent: "$780",
    status: "Inactive",
    joinDate: "Mar 10, 2024",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    totalOrders: 15,
    totalSpent: "$3,200",
    status: "Active",
    joinDate: "Jan 5, 2024",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    totalOrders: 10,
    totalSpent: "$1,650",
    status: "Active",
    joinDate: "Apr 12, 2024",
  },
];

// Sales Chart Data
export const salesChartData = [
  { month: "Jan", sales: 45000, orders: 320 },
  { month: "Feb", sales: 52000, orders: 380 },
  { month: "Mar", sales: 48000, orders: 350 },
  { month: "Apr", sales: 61000, orders: 420 },
  { month: "May", sales: 55000, orders: 390 },
  { month: "Jun", sales: 67000, orders: 450 },
  { month: "Jul", sales: 72000, orders: 490 },
  { month: "Aug", sales: 68000, orders: 470 },
  { month: "Sep", sales: 75000, orders: 510 },
  { month: "Oct", sales: 82000, orders: 560 },
  { month: "Nov", sales: 78000, orders: 530 },
  { month: "Dec", sales: 89500, orders: 620 },
];

// Weekly Report Data
export const weeklyReportData = {
  thisWeek: {
    chartData: {
      customers: [
        { day: "Sun", value: 7000 },
        { day: "Mon", value: 7500 },
        { day: "Tue", value: 8200 },
        { day: "Wed", value: 7100 },
        { day: "Thu", value: 8800 },
        { day: "Fri", value: 8300 },
        { day: "Sat", value: 9100 },
      ],
      totalProducts: [
        { day: "Sun", value: 100 },
        { day: "Mon", value: 320 },
        { day: "Tue", value: 500 },
        { day: "Wed", value: 500 },
        { day: "Thu", value: 500 },
        { day: "Fri", value: 260 },
        { day: "Sat", value: 580 },
      ],
      stockProducts: [
        { day: "Sun", value: 350 },
        { day: "Mon", value: 360 },
        { day: "Tue", value: 380 },
        { day: "Wed", value: 370 },
        { day: "Thu", value: 400 },
        { day: "Fri", value: 390 },
        { day: "Sat", value: 410 },
      ],
      outOfStock: [
        { day: "Sun", value: 70 },
        { day: "Mon", value: 65 },
        { day: "Tue", value: 80 },
        { day: "Wed", value: 75 },
        { day: "Thu", value: 85 },
        { day: "Fri", value: 78 },
        { day: "Sat", value: 72 },
      ],
      revenue: [
        { day: "Sun", value: 15000 },
        { day: "Mon", value: 18000 },
        { day: "Tue", value: 28000 },
        { day: "Wed", value: 14000 },
        { day: "Thu", value: 35000 },
        { day: "Fri", value: 25000 },
        { day: "Sat", value: 30000 },
      ],
    },
    stats: {
      customers: "52k",
      totalProducts: "3.5k",
      stockProducts: "2.5k",
      outOfStock: "0.5k",
      revenue: "250k",
    },
  },
  lastWeek: {
    chartData: {
      customers: [
        { day: "Sun", value: 6500 },
        { day: "Mon", value: 7000 },
        { day: "Tue", value: 7800 },
        { day: "Wed", value: 6800 },
        { day: "Thu", value: 8000 },
        { day: "Fri", value: 7600 },
        { day: "Sat", value: 8300 },
      ],
      totalProducts: [
        { day: "Sun", value: 480 },
        { day: "Mon", value: 490 },
        { day: "Tue", value: 510 },
        { day: "Wed", value: 500 },
        { day: "Thu", value: 530 },
        { day: "Fri", value: 520 },
        { day: "Sat", value: 540 },
      ],
      stockProducts: [
        { day: "Sun", value: 320 },
        { day: "Mon", value: 330 },
        { day: "Tue", value: 350 },
        { day: "Wed", value: 340 },
        { day: "Thu", value: 370 },
        { day: "Fri", value: 360 },
        { day: "Sat", value: 380 },
      ],
      outOfStock: [
        { day: "Sun", value: 80 },
        { day: "Mon", value: 75 },
        { day: "Tue", value: 90 },
        { day: "Wed", value: 85 },
        { day: "Thu", value: 95 },
        { day: "Fri", value: 88 },
        { day: "Sat", value: 82 },
      ],
      revenue: [
        { day: "Sun", value: 12000 },
        { day: "Mon", value: 16000 },
        { day: "Tue", value: 22000 },
        { day: "Wed", value: 18000 },
        { day: "Thu", value: 25000 },
        { day: "Fri", value: 20000 },
        { day: "Sat", value: 24000 },
      ],
    },
    stats: {
      customers: "48k",
      totalProducts: "3.4k",
      stockProducts: "2.3k",
      outOfStock: "0.6k",
      revenue: "210k",
    },
  },
};

// Country Sales Data
export const countrySalesData = {
  totalUsers: "21.5K",
  usersPerMinute: [
    34, 52, 41, 68, 45, 62, 38, 55, 44, 70, 58, 48, 66, 52, 75, 62, 50, 58, 43,
    65,
  ],
  countries: [
    {
      countryCode: "US",
      name: "US",
      sales: "30k",
      progress: 65,
      change: 25.8,
      isPositive: true,
    },
    {
      countryCode: "BR",
      name: "Brazil",
      sales: "30k",
      progress: 45,
      change: 15.8,
      isPositive: false,
    },
    {
      countryCode: "AU",
      name: "Australia",
      sales: "25k",
      progress: 55,
      change: 35.8,
      isPositive: true,
    },
  ],
};

// Recent Transactions Data
export const recentTransactionsData = {
  transactions: [
    {
      no: 1,
      customerId: "#6545",
      orderDate: "01 Oct | 11:29 am",
      status: "Paid",
      amount: "$64",
    },
    {
      no: 2,
      customerId: "#5412",
      orderDate: "01 Oct | 11:29 am",
      status: "Pending",
      amount: "$557",
    },
    {
      no: 3,
      customerId: "#6622",
      orderDate: "01 Oct | 11:29 am",
      status: "Paid",
      amount: "$156",
    },
    {
      no: 4,
      customerId: "#6462",
      orderDate: "01 Oct | 11:29 am",
      status: "Paid",
      amount: "$265",
    },
    {
      no: 5,
      customerId: "#6462",
      orderDate: "01 Oct | 11:29 am",
      status: "Paid",
      amount: "$265",
    },
    {
      no: 3,
      customerId: "#6622",
      orderDate: "01 Oct | 11:29 am",
      status: "Paid",
      amount: "$156",
    },
  ],
};

// Top Products Data
export const topProductsData = {
  products: [
    {
      name: "Apple iPhone 13",
      itemCode: "#FXZ-4567",
      price: "$999.00",
      image: "",
    },
    {
      name: "Nike Air Jordan",
      itemCode: "#FXZ-4567",
      price: "$72.40",
      image: "",
    },
    {
      name: "T-shirt",
      itemCode: "#FXZ-4567",
      price: "$35.40",
      image: "",
    },
    {
      name: "Assorted Cross Bag",
      itemCode: "#FXZ-4567",
      price: "$80.00",
      image: "",
    },
  ],
};

// Best Selling Product Data
export const bestSellingProductData = {
  products: [
    {
      name: "Apple iPhone 13",
      totalOrder: 104,
      status: "Stock",
      price: "$999.00",
      image: "",
    },
    {
      name: "Nike Air Jordan",
      totalOrder: 56,
      status: "Stock out",
      price: "$999.00",
      image: "",
    },
    {
      name: "T-shirt",
      totalOrder: 266,
      status: "Stock",
      price: "$999.00",
      image: "",
    },
    {
      name: "Cross Bag",
      totalOrder: 506,
      status: "Stock",
      price: "$999.00",
      image: "",
    },
  ],
};

// Add New Product Data
export const addNewProductData = {
  categories: [
    { name: "Electronic", icon: "" },
    { name: "Fashion", icon: "" },
    { name: "Home", icon: "" },
  ],
  products: [
    { name: "Smart Fitness Tracker", price: "$39.99", image: "" },
    { name: "Leather Wallet", price: "$19.99", image: "" },
    { name: "Electric Hair Trimmer", price: "$34.99", image: "" },
  ],
};

// Orders Stats Data
export const ordersStatsData = [
  {
    title: "Total Orders",
    value: "1,240",
    change: { value: "14.4%", isPositive: true },
    subtitle: "Last 7 days",
  },
  {
    title: "New Orders",
    value: "240",
    change: { value: "20%", isPositive: true },
    subtitle: "Last 7 days",
  },
  {
    title: "Completed Orders",
    value: "960",
    change: { value: "85%", isPositive: true },
    subtitle: "Last 7 days",
  },
  {
    title: "Canceled Orders",
    value: "87",
    change: { value: "5%", isPositive: false },
    subtitle: "Last 7 days",
  },
];

// Orders Table Data
export const ordersTableData = [
  {
    id: "#ORD0001",
    product: {
      name: "Wireless Bluetooth Headphones",
      icon: "🎧",
    },
    date: "01-01-2025",
    price: 49.99,
    payment: { status: "Paid", isPaid: true },
    status: "Delivered",
  },
  {
    id: "#ORD0001",
    product: {
      name: "Men's T-Shirt",
      icon: "👕",
    },
    date: "01-01-2025",
    price: 14.99,
    payment: { status: "Unpaid", isPaid: false },
    status: "Pending",
  },
  {
    id: "#ORD0001",
    product: {
      name: "Men's Leather Wallet",
      icon: "👛",
    },
    date: "01-01-2025",
    price: 49.99,
    payment: { status: "Paid", isPaid: true },
    status: "Delivered",
  },
  {
    id: "#ORD0001",
    product: {
      name: "Memory Foam Pillow",
      icon: "🛏️",
    },
    date: "01-01-2025",
    price: 39.99,
    payment: { status: "Paid", isPaid: true },
    status: "Shipped",
  },
  {
    id: "#ORD0001",
    product: {
      name: "Adjustable Dumbbells",
      icon: "🏋️",
    },
    date: "01-01-2025",
    price: 14.99,
    payment: { status: "Unpaid", isPaid: false },
    status: "Pending",
  },
  {
    id: "#ORD0001",
    product: {
      name: "Coffee Maker",
      icon: "☕",
    },
    date: "01-01-2025",
    price: 79.99,
    payment: { status: "Unpaid", isPaid: false },
    status: "Cancelled",
  },
  {
    id: "#ORD0001",
    product: {
      name: "Casual Baseball Cap",
      icon: "🧢",
    },
    date: "01-01-2025",
    price: 49.99,
    payment: { status: "Paid", isPaid: true },
    status: "Delivered",
  },
  {
    id: "#ORD0001",
    product: {
      name: "Full HD Webcam",
      icon: "📹",
    },
    date: "01-01-2025",
    price: 39.99,
    payment: { status: "Paid", isPaid: true },
    status: "Delivered",
  },
  {
    id: "#ORD0001",
    product: {
      name: "Smart LED Color Bulb",
      icon: "💡",
    },
    date: "01-01-2025",
    price: 79.99,
    payment: { status: "Unpaid", isPaid: false },
    status: "Delivered",
  },
  {
    id: "#ORD0001",
    product: {
      name: "Men's T-Shirt",
      icon: "👕",
    },
    date: "01-01-2025",
    price: 14.99,
    payment: { status: "Unpaid", isPaid: false },
    status: "Delivered",
  },
];

// Customer Stats Data
export const customerStatsData = [
  {
    title: "Total Customers",
    value: "11,040",
    change: { value: "14.4%", isPositive: true },
    subtitle: "Last 7 days",
  },
  {
    title: "New Customers",
    value: "2,370",
    change: { value: "20%", isPositive: true },
    subtitle: "Last 7 days",
  },
  {
    title: "Visitor",
    value: "250k",
    change: { value: "20%", isPositive: true },
    subtitle: "Last 7 days",
  },
];

// Customer Overview Data
export const customerOverviewData = {
  thisWeek: {
    chartData: {
      activeCustomers: [
        { day: "Sun", value: 20000 },
        { day: "Mon", value: 22000 },
        { day: "Tue", value: 30000 },
        { day: "Wed", value: 35000 },
        { day: "Thu", value: 25409 },
        { day: "Fri", value: 40000 },
        { day: "Sat", value: 38000 },
      ],
      repeatCustomers: [
        { day: "Sun", value: 3000 },
        { day: "Mon", value: 3500 },
        { day: "Tue", value: 4200 },
        { day: "Wed", value: 4800 },
        { day: "Thu", value: 5000 },
        { day: "Fri", value: 5500 },
        { day: "Sat", value: 5300 },
      ],
      shopVisitor: [
        { day: "Sun", value: 150000 },
        { day: "Mon", value: 180000 },
        { day: "Tue", value: 200000 },
        { day: "Wed", value: 220000 },
        { day: "Thu", value: 210000 },
        { day: "Fri", value: 240000 },
        { day: "Sat", value: 250000 },
      ],
      conversionRate: [
        { day: "Sun", value: 4.2 },
        { day: "Mon", value: 4.5 },
        { day: "Tue", value: 4.8 },
        { day: "Wed", value: 5.2 },
        { day: "Thu", value: 5.0 },
        { day: "Fri", value: 5.5 },
        { day: "Sat", value: 5.5 },
      ],
    },
    stats: {
      activeCustomers: "25k",
      repeatCustomers: "5.6k",
      shopVisitor: "250k",
      conversionRate: "5.5%",
    },
  },
  lastWeek: {
    chartData: {
      activeCustomers: [
        { day: "Sun", value: 18000 },
        { day: "Mon", value: 20000 },
        { day: "Tue", value: 28000 },
        { day: "Wed", value: 32000 },
        { day: "Thu", value: 23000 },
        { day: "Fri", value: 35000 },
        { day: "Sat", value: 33000 },
      ],
      repeatCustomers: [
        { day: "Sun", value: 2800 },
        { day: "Mon", value: 3200 },
        { day: "Tue", value: 3800 },
        { day: "Wed", value: 4400 },
        { day: "Thu", value: 4600 },
        { day: "Fri", value: 5000 },
        { day: "Sat", value: 4800 },
      ],
      shopVisitor: [
        { day: "Sun", value: 140000 },
        { day: "Mon", value: 170000 },
        { day: "Tue", value: 190000 },
        { day: "Wed", value: 210000 },
        { day: "Thu", value: 200000 },
        { day: "Fri", value: 230000 },
        { day: "Sat", value: 240000 },
      ],
      conversionRate: [
        { day: "Sun", value: 4.0 },
        { day: "Mon", value: 4.3 },
        { day: "Tue", value: 4.5 },
        { day: "Wed", value: 4.9 },
        { day: "Thu", value: 4.7 },
        { day: "Fri", value: 5.2 },
        { day: "Sat", value: 5.0 },
      ],
    },
    stats: {
      activeCustomers: "23k",
      repeatCustomers: "5.2k",
      shopVisitor: "240k",
      conversionRate: "5.0%",
    },
  },
};

// Customer Table Data
export const customerTableData = [
  {
    id: "#CUST001",
    name: "John Doe",
    phone: "+1234567890",
    orderCount: 25,
    totalSpend: 3450.0,
    status: "Active",
  },
  {
    id: "#CUST001",
    name: "John Doe",
    phone: "+1234567890",
    orderCount: 25,
    totalSpend: 3450.0,
    status: "Active",
  },
  {
    id: "#CUST001",
    name: "John Doe",
    phone: "+1234567890",
    orderCount: 25,
    totalSpend: 3450.0,
    status: "Active",
  },
  {
    id: "#CUST001",
    name: "John Doe",
    phone: "+1234567890",
    orderCount: 25,
    totalSpend: 3450.0,
    status: "Active",
  },
  {
    id: "#CUST001",
    name: "Jane Smith",
    phone: "+1234567890",
    orderCount: 5,
    totalSpend: 250.0,
    status: "Inactive",
  },
  {
    id: "#CUST001",
    name: "Emily Davis",
    phone: "+1234567890",
    orderCount: 30,
    totalSpend: 4600.0,
    status: "VIP",
  },
  {
    id: "#CUST001",
    name: "Jane Smith",
    phone: "+1234567890",
    orderCount: 5,
    totalSpend: 250.0,
    status: "Inactive",
  },
  {
    id: "#CUST001",
    name: "John Doe",
    phone: "+1234567890",
    orderCount: 25,
    totalSpend: 3450.0,
    status: "Active",
  },
  {
    id: "#CUST001",
    name: "Emily Davis",
    phone: "+1234567890",
    orderCount: 30,
    totalSpend: 4600.0,
    status: "VIP",
  },
  {
    id: "#CUST001",
    name: "Jane Smith",
    phone: "+1234567890",
    orderCount: 5,
    totalSpend: 250.0,
    status: "Inactive",
  },
];

// Customer Detail Data
export const customerDetailData = {
  id: "CUST001",
  name: "Randhir Kumar",
  avatar: "R",
  country: "India",
  orderCount: 5,
  customerSince: "2 years",
  rating: 5,
  address: {
    street: "Panapur langa",
    city: "Hajipur,vaishali",
    postalCode: "844124",
    country: "India",
  },
  email: "randhirppl@gmail.com",
  phone: "+91 8804789764",
  notes: "",
  orders: [
    {
      id: "#23534D",
      date: "May 25, 3:12 PM",
      status: "Pending",
      price: 29.74,
    },
    {
      id: "#12512B",
      date: "May 10, 2:00 PM",
      status: "Completed",
      price: 23.06,
    },
    {
      id: "#23534D",
      date: "April 18, 8:00 AM",
      status: "Completed",
      price: 29.74,
    },
    {
      id: "#76543E",
      date: "April 12, 8:00 AM",
      status: "Completed",
      price: 23.06,
    },
    {
      id: "#51323C",
      date: "April 10, 4:12 PM",
      status: "Completed",
      price: 23.06,
    },
  ],
  tags: ["Vip Customer", "Europe"],
};

// Categories Data
export const categoriesData = [
  {
    id: "1",
    name: "Electronics",
    image: "/categories/electronics.png",
  },
  {
    id: "2",
    name: "Fashion",
    image: "/categories/fashion.png",
  },
  {
    id: "3",
    name: "Accessories",
    image: "/categories/accessories.png",
  },
  {
    id: "4",
    name: "Home & Kitchen",
    image: "/categories/home-kitchen.png",
  },
  {
    id: "5",
    name: "Sports & Outdoors",
    image: "/categories/sports.png",
  },
  {
    id: "6",
    name: "Toys & Games",
    image: "/categories/toys.png",
  },
  {
    id: "7",
    name: "Health & Fitness",
    image: "/categories/health.png",
  },
  {
    id: "8",
    name: "Books",
    image: "/categories/books.png",
  },
];

// Products List Data
export const productsListData = [
  {
    id: 1,
    name: "Men Grey Hoodie",
    category: "Hoodies",
    image: "🧥",
    inventory: "96 in stock",
    color: "Black",
    price: "$49.90",
    rating: "5.0 (32 Votes)",
    inStock: true,
  },
  {
    id: 2,
    name: "Women Striped T-Shirt",
    category: "T-Shirt",
    image: "👕",
    inventory: "56 in stock",
    color: "White",
    price: "$34.90",
    rating: "4.8 (24 Votes)",
    inStock: true,
  },
  {
    id: 3,
    name: "Women White T-Shirt",
    category: "T-Shirt",
    image: "👕",
    inventory: "78 in stock",
    color: "White",
    price: "$40.90",
    rating: "5.0 (54 Votes)",
    inStock: true,
  },
  {
    id: 4,
    name: "Men White T-Shirt",
    category: "T-Shirt",
    image: "👕",
    inventory: "32 in stock",
    color: "White",
    price: "$49.90",
    rating: "4.5 (31 Votes)",
    inStock: true,
  },
  {
    id: 5,
    name: "Women Red T-Shirt",
    category: "T-Shirt",
    image: "👕",
    inventory: "32 in stock",
    color: "White",
    price: "$34.90",
    rating: "4.9 (22 Votes)",
    inStock: true,
  },
  {
    id: 6,
    name: "Men Grey Hoodie",
    category: "Hoodies",
    image: "🧥",
    inventory: "96 in stock",
    color: "Black",
    price: "$49.90",
    rating: "5.0 (32 Votes)",
    inStock: true,
  },
  {
    id: 7,
    name: "Women Striped T-Shirt",
    category: "T-Shirt",
    image: "👕",
    inventory: "56 in stock",
    color: "White",
    price: "$34.90",
    rating: "4.8 (24 Votes)",
    inStock: true,
  },
  {
    id: 8,
    name: "Women White T-Shirt",
    category: "T-Shirt",
    image: "👕",
    inventory: "Out of Stock",
    color: "White",
    price: "$40.90",
    rating: "5.0 (54 Votes)",
    inStock: false,
  },
  {
    id: 9,
    name: "Men White T-Shirt",
    category: "T-Shirt",
    image: "👕",
    inventory: "Out of Stock",
    color: "White",
    price: "$49.90",
    rating: "4.5 (31 Votes)",
    inStock: false,
  },
  {
    id: 10,
    name: "Women Red T-Shirt",
    category: "T-Shirt",
    image: "👕",
    inventory: "Out of Stock",
    color: "White",
    price: "$34.90",
    rating: "4.9 (22 Votes)",
    inStock: false,
  },
];

// Category Products Data (for edit/create category page)
export const categoryProductsData = [
  {
    id: 1,
    name: "Women Striped T-Shirt",
    image: "/products/striped-tshirt.png",
  },
  { id: 2, name: "Women White T-Shirt", image: "/products/white-tshirt.png" },
  { id: 3, name: "Women White T-Shirt", image: "/products/white-tshirt-2.png" },
  { id: 4, name: "Women Black Dress", image: "/products/black-dress.png" },
  {
    id: 5,
    name: "Women Striped T-Shirt",
    image: "/products/striped-tshirt-2.png",
  },
  { id: 6, name: "Women White T-Shirt", image: "/products/white-tshirt-3.png" },
  { id: 7, name: "Women White T-Shirt", image: "/products/white-tshirt-4.png" },
  { id: 8, name: "Women Black Dress", image: "/products/black-dress-2.png" },
];

// Transaction Stats Data
export const transactionStatsData = [
  {
    title: "Total Revenue",
    value: "$15,045",
    change: { value: "14.4%", isPositive: true },
    subtitle: "Last 7 days",
  },
  {
    title: "Completed Transactions",
    value: "3,150",
    change: { value: "20%", isPositive: true },
    subtitle: "Last 7 days",
  },
  {
    title: "Pending Transactions",
    value: "150",
    change: { value: "85%", isPositive: true },
    subtitle: "Last 7 days",
  },
  {
    title: "Failed Transactions",
    value: "75",
    change: { value: "15%", isPositive: false },
    subtitle: "Last 7 days",
  },
];

// Payment Card Data
export const paymentCardData = {
  cardNumber: "2345",
  cardHolder: "Noman Mansoor",
  expiryDate: "02/30",
  status: "Active",
  transactions: 1250,
  revenue: "$50,000",
};

// Transaction History Data
export const transactionHistoryData = [
  {
    id: 1,
    customerId: "#CUST001",
    name: "John Doe",
    date: "01-01-2025",
    total: "$2,904",
    method: "CC",
    status: "Complete",
  },
  {
    id: 2,
    customerId: "#CUST001",
    name: "John Doe",
    date: "01-01-2025",
    total: "$2,904",
    method: "PayPal",
    status: "Complete",
  },
  {
    id: 3,
    customerId: "#CUST001",
    name: "John Doe",
    date: "01-01-2025",
    total: "$2,904",
    method: "CC",
    status: "Complete",
  },
  {
    id: 4,
    customerId: "#CUST001",
    name: "John Doe",
    date: "01-01-2025",
    total: "$2,904",
    method: "Bank",
    status: "Complete",
  },
  {
    id: 5,
    customerId: "#CUST001",
    name: "Jane Smith",
    date: "01-01-2025",
    total: "$2,904",
    method: "CC",
    status: "Canceled",
  },
  {
    id: 6,
    customerId: "#CUST001",
    name: "Emily Davis",
    date: "01-01-2025",
    total: "$2,904",
    method: "PayPal",
    status: "Pending",
  },
  {
    id: 7,
    customerId: "#CUST001",
    name: "Jane Smith",
    date: "01-01-2025",
    total: "$2,904",
    method: "Bank",
    status: "Canceled",
  },
  {
    id: 8,
    customerId: "#CUST001",
    name: "John Doe",
    date: "01-01-2025",
    total: "$2,904",
    method: "CC",
    status: "Complete",
  },
  {
    id: 9,
    customerId: "#CUST001",
    name: "Emily Davis",
    date: "01-01-2025",
    total: "$2,904",
    method: "PayPal",
    status: "Pending",
  },
  {
    id: 10,
    customerId: "#CUST001",
    name: "Jane Smith",
    date: "01-01-2025",
    total: "$2,904",
    method: "Bank",
    status: "Canceled",
  },
];

export const customerGrowthData = [
  { month: "Jan", returningCustomers: 450, newCustomers: 340 },
  { month: "Feb", returningCustomers: 370, newCustomers: 260 },
  { month: "Mar", returningCustomers: 340, newCustomers: 170 },
  { month: "Apr", returningCustomers: 430, newCustomers: 260 },
  { month: "May", returningCustomers: 460, newCustomers: 200 },
  { month: "Jun", returningCustomers: 360, newCustomers: 260 },
  { month: "Jul", returningCustomers: 410, newCustomers: 190 },
  { month: "Aug", returningCustomers: 430, newCustomers: 150 },
  { month: "Sep", returningCustomers: 440, newCustomers: 190 },
  { month: "Oct", returningCustomers: 400, newCustomers: 260 },
  { month: "Nov", returningCustomers: 430, newCustomers: 150 },
  { month: "Dec", returningCustomers: 430, newCustomers: 120 },
];

export const visitorStatsData = [
  {
    title: "Existing Users",
    value: "5.653",
    change: "22.45%",
    isPositive: true,
  },
  {
    title: "New Users",
    value: "1.650",
    change: "15.34%",
    isPositive: true,
  },
  {
    title: "Total Visits",
    value: "9.504",
    change: "18.25%",
    isPositive: false,
  },
  {
    title: "Unique Visits",
    value: "5.423",
    change: "10.24%",
    isPositive: false,
  },
];
