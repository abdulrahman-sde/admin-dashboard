interface TopProductsProps {
  data: Array<{
    id: string;
    name: string;
    image: string;
    clicks: string;
    unitsSold: number;
  }>;
}

export function TopProducts({ data }: TopProductsProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
      <h2 className="text-[17px] font-bold text-gray-900 mb-8">Top Products</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[#8E92BC]">
            <tr>
              <th className="pb-6 font-medium text-left">Name</th>
              <th className="pb-6 font-medium text-center">Clicks</th>
              <th className="pb-6 font-medium text-right">Units Sold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((product) => (
              <tr key={product.id}>
                <td className="py-4 flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-gray-700">
                    {product.name}
                  </span>
                </td>
                <td className="py-4 text-center text-[#5D6679]">
                  {product.clicks}
                </td>
                <td className="py-4 text-right font-bold text-[#5D6679]">
                  {product.unitsSold}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
