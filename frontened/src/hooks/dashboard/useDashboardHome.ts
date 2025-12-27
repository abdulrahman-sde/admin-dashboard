import { useGetAnalytics } from "@/hooks/analytics/useGetAnalytics";

export const useDashboardHome = () => {
  const {
    stats,
    weeklySalesChange,
    weeklyOrdersChange,
    weeklyCancelledOrderChange,
    isFetching,
  } = useGetAnalytics();

  // Map analytics products to component formats
  const topProductsFormatted = stats?.products?.topProducts
    ?.slice(0, 4)
    .map((p) => ({
      name: p.name,
      itemCode: p.sku || p.id.slice(-6).toUpperCase(),
      price: p.price,
      image: p.thumbnail || p.images[0] || "",
    }));

  const bestSellingProductsFormatted = stats?.products?.topProducts
    ?.slice(0, 5)
    .map((p) => ({
      name: p.name,
      totalOrder: p.totalSales || 0,
      status: p.stockQuantity > 0 ? "Stock" : "Out of Stock",
      price: p.price,
      image: p.thumbnail || p.images[0] || "",
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
