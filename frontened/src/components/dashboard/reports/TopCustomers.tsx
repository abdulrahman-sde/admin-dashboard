import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetTopCustomersQuery } from "@/lib/store/services/reportsApi";

const TopCustomers = () => {
  const { data: customers, isLoading } = useGetTopCustomersQuery({ limit: 5 });

  if (isLoading)
    return (
      <div className="h-[300px] bg-white rounded-xl p-6 border border-gray-100 animate-pulse" />
    );

  return (
    <div className="bg-white p-6 rounded-2xl">
      <h3 className="mb-6 text-base font-semibold text-gray-900">
        Top Customers
      </h3>

      <div className="space-y-6">
        <div className="flex items-center text-xs font-medium text-gray-400">
          <span className="flex-1">Name</span>
          <span className="w-16 text-right">Orders</span>
          <span className="w-20 text-right">Spent</span>
        </div>

        {customers?.map((customer) => (
          <div key={customer.id} className="flex items-center">
            <div className="flex flex-1 items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={customer.avatar} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium text-xs">
                  {customer.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">
                {customer.name}
              </span>
            </div>
            <div className="w-16 text-right text-sm text-gray-600">
              {customer.orders}
            </div>
            <div className="w-20 text-right text-sm font-medium text-gray-900">
              ${customer.spent.toLocaleString()}
            </div>
          </div>
        ))}

        {!isLoading && customers?.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-4">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCustomers;
