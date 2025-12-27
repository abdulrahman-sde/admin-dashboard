import { StatCard } from "@/components/shared/StatCard";
import CustomerOverview from "@/components/dashboard/customers/CustomerOverview";
import { CustomerTable } from "@/components/dashboard/customers/CustomerTable";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useDashboardCustomers } from "@/hooks/dashboard/useDashboardCustomers";

export default function Users() {
  const { dynamicStats, isFetching } = useDashboardCustomers();

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
          <CustomerOverview />
        </div>
      </div>

      {/* Customer Table */}
      <CustomerTable />
    </div>
  );
}
