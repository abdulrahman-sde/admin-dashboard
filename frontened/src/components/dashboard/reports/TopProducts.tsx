import { useGetTopProductsQuery } from "@/lib/store/services/reportsApi";

const TopProducts = () => {
  const { data: products, isLoading } = useGetTopProductsQuery({ limit: 5 });

  if (isLoading)
    return (
      <div className="h-[300px] bg-white rounded-xl p-6 border border-gray-100 animate-pulse" />
    );

  return (
    <div className="bg-white p-6 rounded-2xl">
      <h3 className="mb-6 text-base font-semibold text-gray-900">
        Top Products
      </h3>

      <div className="space-y-6">
        <div className="flex items-center text-xs font-medium text-gray-400">
          <span className="flex-1">Name</span>
          <span className="w-16 text-right">Clicks</span>
          <span className="w-20 text-right">Units Sold</span>
        </div>

        {products?.map((product) => (
          <div key={product.id} className="flex items-center">
            <div className="flex flex-1 items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100 border border-gray-200">
                {product.image || product.images?.[0] ? (
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                    IMG
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 line-clamp-1 pr-2">
                {product.name}
              </span>
            </div>
            <div className="w-16 text-right text-sm text-gray-600">
              {product.clicks?.toLocaleString() || 0}
            </div>
            <div className="w-20 text-right text-sm font-medium text-gray-900">
              {product.unitsSold}
            </div>
          </div>
        ))}

        {!isLoading && products?.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-4">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
