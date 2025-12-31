interface TopCustomersProps {
  data: Array<{
    id: string;
    name: string;
    avatar: string | null;
    orders: number;
    spent: number;
  }>;
}

export function TopCustomers({ data }: TopCustomersProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
      <h2 className="text-[17px] font-bold text-gray-900 mb-8">
        Top Customers
      </h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[#8E92BC]">
            <tr>
              <th className="pb-6 font-medium text-left">Name</th>
              <th className="pb-6 font-medium text-center">Orders</th>
              <th className="pb-6 font-medium text-right">Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((customer) => (
              <tr key={customer.id}>
                <td className="py-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#4EA674] text-white flex items-center justify-center font-bold text-[12px]">
                    {customer.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-700">
                    {customer.name}
                  </span>
                </td>
                <td className="py-4 text-center text-[#5D6679]">
                  {customer.orders}
                </td>
                <td className="py-4 text-right font-bold text-[#5D6679]">
                  ${customer.spent.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
