import { useGetCategoriesQuery } from "@/lib/store/services/categories/categoryApi";
import { useGetProductsQuery } from "@/lib/store/services/products/productsApi";

export function useQuickAccess() {
  const { data: categoriesData, isLoading: loadingCategories } =
    useGetCategoriesQuery();
  const { data: productsData, isLoading: loadingProducts } =
    useGetProductsQuery({
      page: 1,
      limit: 3,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const categories = categoriesData?.data?.slice(0, 3) || [];
  const products = productsData?.data?.slice(0, 3) || [];

  return {
    categories,
    products,
    isLoading: loadingCategories || loadingProducts,
  };
}
