import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopProductsProps {
  data: Array<{
    id: number;
    name: string;
    image: string;
    clicks: string;
    unitsSold: number;
  }>;
}

export function TopProducts({ data }: TopProductsProps) {
  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-base font-bold">Top Products</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Clicks</th>
                <th className="px-6 py-3 font-medium text-right">Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {data.map((product) => (
                <tr
                  key={product.id}
                  className="border-b last:border-0 hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden shrink-0">
                      {/* Placeholder for images since we don't have real assets */}
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-400">
                        IMG
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.clicks}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {product.unitsSold}
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
