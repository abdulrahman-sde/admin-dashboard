import { StatCard } from "@/components/shared/StatCard";
import CustomerOverview from "@/components/dashboard/customers/CustomerOverview";
import { CustomerTable } from "@/components/dashboard/customers/CustomerTable";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useGetAnalytics } from "@/hooks/analytics/useGetAnalytics";

export default function Users() {
  const {
    stats,
    weeklyCustomersChange,
    weeklyNewCustomersChange,
    weeklyVisitsChange,
    isFetching,
  } = useGetAnalytics();

  const dynamicStats = [
    {
      title: "Total Customers",
      value: stats?.customers.thisWeek.totalCustomers ?? 0,
      change: {
        value: Math.abs(weeklyCustomersChange),
        isPositive: weeklyCustomersChange >= 0,
      },
      subtitle: "Last 7 days",
    },
    {
      title: "New Customers",
      value: stats?.customers.thisWeek.newCustomers ?? 0,
      change: {
        value: Math.abs(weeklyNewCustomersChange),
        isPositive: weeklyNewCustomersChange >= 0,
      },
      subtitle: "Last 7 days",
    },
    {
      title: "Visitor",
      value: stats?.customers.thisWeek.totalVisits ?? 0,
      change: {
        value: Math.abs(weeklyVisitsChange),
        isPositive: weeklyVisitsChange >= 0,
      },
      subtitle: "Last 7 days",
    },
  ];

  // Build dynamic customer overview data from analytics
  const customerOverviewData = {
    thisWeek: {
      stats: {
        activeCustomers: stats?.customers?.thisWeek?.totalCustomers ?? 0,
        repeatCustomers: stats?.customers?.thisWeek?.returningCustomers ?? 0,
        shopVisitor: stats?.customers?.thisWeek?.totalVisits ?? 0,
        conversionRate:
          stats?.orders?.thisWeek?.totalOrders &&
          stats?.customers?.thisWeek?.totalVisits
            ? `${(
                (stats.orders.thisWeek.totalOrders /
                  stats.customers.thisWeek.totalVisits) *
                100
              ).toFixed(1)}%`
            : "0%",
      },
      chartData: {
        activeCustomers: [
          {
            day: "Sun",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
          {
            day: "Mon",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
          {
            day: "Tue",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
          {
            day: "Wed",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
          {
            day: "Thu",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
          {
            day: "Fri",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
          {
            day: "Sat",
            value: stats?.customers?.thisWeek?.totalCustomers ?? 0,
          },
        ],
        repeatCustomers: [
          {
            day: "Sun",
            value: stats?.customers?.thisWeek?.returningCustomers ?? 0,
          },
          {
            day: "Mon",
            value: stats?.customers?.thisWeek?.returningCustomers ?? 0,
          },
          {
            day: "Tue",
            value: stats?.customers?.thisWeek?.returningCustomers ?? 0,
          },
          {
            day: "Wed",
            value: stats?.customers?.thisWeek?.returningCustomers ?? 0,
          },
          {
            day: "Thu",
            value: stats?.customers?.thisWeek?.returningCustomers ?? 0,
          },
          {
            day: "Fri",
            value: stats?.customers?.thisWeek?.returningCustomers ?? 0,
          },
          {
            day: "Sat",
            value: stats?.customers?.thisWeek?.returningCustomers ?? 0,
          },
        ],
        shopVisitor: [
          { day: "Sun", value: stats?.customers?.thisWeek?.totalVisits ?? 0 },
          { day: "Mon", value: stats?.customers?.thisWeek?.totalVisits ?? 0 },
          { day: "Tue", value: stats?.customers?.thisWeek?.totalVisits ?? 0 },
          { day: "Wed", value: stats?.customers?.thisWeek?.totalVisits ?? 0 },
          { day: "Thu", value: stats?.customers?.thisWeek?.totalVisits ?? 0 },
          { day: "Fri", value: stats?.customers?.thisWeek?.totalVisits ?? 0 },
          { day: "Sat", value: stats?.customers?.thisWeek?.totalVisits ?? 0 },
        ],
        conversionRate: [
          { day: "Sun", value: 0 },
          { day: "Mon", value: 0 },
          { day: "Tue", value: 0 },
          { day: "Wed", value: 0 },
          { day: "Thu", value: 0 },
          { day: "Fri", value: 0 },
          { day: "Sat", value: 0 },
        ],
      },
    },
    lastWeek: {
      stats: {
        activeCustomers: stats?.customers?.previousWeek?.totalCustomers ?? 0,
        repeatCustomers:
          stats?.customers?.previousWeek?.returningCustomers ?? 0,
        shopVisitor: stats?.customers?.previousWeek?.totalVisits ?? 0,
        conversionRate:
          stats?.orders?.previousWeek?.totalOrders &&
          stats?.customers?.previousWeek?.totalVisits
            ? `${(
                (stats.orders.previousWeek.totalOrders /
                  stats.customers.previousWeek.totalVisits) *
                100
              ).toFixed(1)}%`
            : "0%",
      },
      chartData: {
        activeCustomers: [
          {
            day: "Sun",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
          {
            day: "Mon",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
          {
            day: "Tue",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
          {
            day: "Wed",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
          {
            day: "Thu",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
          {
            day: "Fri",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
          {
            day: "Sat",
            value: stats?.customers?.previousWeek?.totalCustomers ?? 0,
          },
        ],
        repeatCustomers: [
          {
            day: "Sun",
            value: stats?.customers?.previousWeek?.returningCustomers ?? 0,
          },
          {
            day: "Mon",
            value: stats?.customers?.previousWeek?.returningCustomers ?? 0,
          },
          {
            day: "Tue",
            value: stats?.customers?.previousWeek?.returningCustomers ?? 0,
          },
          {
            day: "Wed",
            value: stats?.customers?.previousWeek?.returningCustomers ?? 0,
          },
          {
            day: "Thu",
            value: stats?.customers?.previousWeek?.returningCustomers ?? 0,
          },
          {
            day: "Fri",
            value: stats?.customers?.previousWeek?.returningCustomers ?? 0,
          },
          {
            day: "Sat",
            value: stats?.customers?.previousWeek?.returningCustomers ?? 0,
          },
        ],
        shopVisitor: [
          {
            day: "Sun",
            value: stats?.customers?.previousWeek?.totalVisits ?? 0,
          },
          {
            day: "Mon",
            value: stats?.customers?.previousWeek?.totalVisits ?? 0,
          },
          {
            day: "Tue",
            value: stats?.customers?.previousWeek?.totalVisits ?? 0,
          },
          {
            day: "Wed",
            value: stats?.customers?.previousWeek?.totalVisits ?? 0,
          },
          {
            day: "Thu",
            value: stats?.customers?.previousWeek?.totalVisits ?? 0,
          },
          {
            day: "Fri",
            value: stats?.customers?.previousWeek?.totalVisits ?? 0,
          },
          {
            day: "Sat",
            value: stats?.customers?.previousWeek?.totalVisits ?? 0,
          },
        ],
        conversionRate: [
          { day: "Sun", value: 0 },
          { day: "Mon", value: 0 },
          { day: "Tue", value: 0 },
          { day: "Wed", value: 0 },
          { day: "Thu", value: 0 },
          { day: "Fri", value: 0 },
          { day: "Sat", value: 0 },
        ],
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Customers</h1>
        <div>
          <Link to="/dashboard/customers/add">
            <Button>Add Customer</Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Customer Stat Cards */}
        <div className="lg:col-span-1 grid grid-cols-1 gap-4">
          {dynamicStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              subtitle={stat.subtitle}
              isLoading={isFetching}
            />
          ))}
        </div>

        {/* Customer Overview Chart */}
        <div className="lg:col-span-3">
          <CustomerOverview data={customerOverviewData} />
        </div>
      </div>

      {/* Customer Table */}
      <CustomerTable />
    </div>
  );
}
