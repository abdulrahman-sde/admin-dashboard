import { useGetAnalytics } from "@/hooks/analytics/useGetAnalytics";
import { useGetProductsQuery } from "@/lib/store/services/products/productsApi";

export const useDashboardHome = () => {
  const {
    stats,
    weeklySalesChange,
    weeklyOrdersChange,
    weeklyCancelledOrderChange,
    isFetching,
  } = useGetAnalytics();

  // Fetch top products from products API (sorted by combined sales+revenue)
  const { data: productsData } = useGetProductsQuery({
    page: 1,
    limit: 5,
    sortBy: "salesAndRevenue",
    sortOrder: "desc",
  });

  const productsList = productsData?.data || stats?.products?.topProducts || [];

  const topProductsFormatted = productsList?.slice(0, 4).map((p: any) => ({
    name: p.name,
    itemCode: p.sku || (p.id && p.id.slice(-6).toUpperCase()),
    price: p.price,
    image: p.thumbnail || p.images?.[0] || "",
  }));

  const bestSellingProductsFormatted = productsList
    ?.slice(0, 5)
    .map((p: any) => ({
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
    isFetching,
    topProductsFormatted,
    bestSellingProductsFormatted,
  };
};
