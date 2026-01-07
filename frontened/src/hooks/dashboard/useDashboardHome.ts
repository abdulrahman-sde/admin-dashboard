import { useGetAnalytics } from "@/hooks/analytics/useGetAnalytics";
import { useGetProductsQuery } from "@/lib/store/services/products/productsApi";
import type { Product } from "@/types/products.types";

export const useDashboardHome = () => {
  const {
    stats,
    weeklySalesChange,
    weeklyOrdersChange,
    weeklyCancelledOrderChange,
    weeklyCustomersChange,
    weeklyNewCustomersChange,
    weeklyVisitsChange,
    countrySalesGrowth,
    isFetching,
  } = useGetAnalytics();

  const { data: productsData } = useGetProductsQuery({
    page: 1,
    limit: 5,
    sortBy: "salesAndRevenue",
    sortOrder: "desc",
  });

  const productsList = productsData?.data || stats?.products?.topProducts || [];

  const topProductsFormatted = productsList?.slice(0, 4).map((p: Product) => ({
    name: p.name,
    itemCode: p.sku || (p.id && p.id.slice(-6).toUpperCase()),
    price: p.price,
    image: p.thumbnail || p.images?.[0] || "",
  }));

  const bestSellingProductsFormatted = productsList
    ?.slice(0, 5)
    .map((p: Product) => ({
      name: p.name,
      totalOrder: p.totalSales || 0,
      status: p.stockQuantity > 0 ? "Stock" : "Out of Stock",
      price: p.price,
      image: p.thumbnail || p.images?.[0] || "",
    }));

  return {
    stats,
    weeklySalesChange,
    weeklyOrdersChange,
    weeklyCancelledOrderChange,
    weeklyCustomersChange,
    weeklyNewCustomersChange,
    weeklyVisitsChange,
    countrySalesGrowth,
    isFetching,
    topProductsFormatted,
    bestSellingProductsFormatted,
  };
};
