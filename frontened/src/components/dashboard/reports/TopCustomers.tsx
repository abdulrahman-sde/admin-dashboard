import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopCustomersProps {
  data: Array<{
    id: number;
    name: string;
    avatar: string;
    orders: number;
    spent: number;
  }>;
}

export function TopCustomers({ data }: TopCustomersProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Top Customers</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Orders</th>
                <th className="px-6 py-3 font-medium text-right">Spent</th>
              </tr>
            </thead>
            <tbody>
              {data.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b last:border-0 hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-emerald-100 text-emerald-600">
                      <AvatarImage src={customer.avatar} />
                      <AvatarFallback className="font-bold">
                        {customer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-900">
                      {customer.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{customer.orders}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    ${customer.spent.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
