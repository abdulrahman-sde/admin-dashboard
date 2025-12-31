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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link to="/dashboard/customers/add" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-[#4EA674] hover:bg-[#3d8a5e]">
            Add Customer
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Customer Stat Cards */}
        <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {dynamicStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              subtitle={stat.subtitle}
              isLoading={isFetching}
              className="h-full"
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
