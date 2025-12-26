import { useGetProductsQuery } from "@/lib/store/services/products/productsApi";
import { generatePagination } from "@/lib/utils";
import type { ProductsQueryParams } from "@/types/products.types";
import { useState, useEffect } from "react";
import type { Meta } from "@/types/products.types";

const tabs: { id: keyof Meta; label: string }[] = [
  { id: "all", label: "All Product" },
  { id: "featured", label: "Featured Products" },
  { id: "onSale", label: "On Sale" },
  { id: "outOfStock", label: "Out of Stock" },
];

export function useProducts(params: ProductsQueryParams = {}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<keyof Meta>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<ProductsQueryParams["sortBy"]>(
    params.sortBy || "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<ProductsQueryParams["sortOrder"]>(
    params.sortOrder || "desc"
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Build query params based on active tab BEFORE the API call
  const queryParams: ProductsQueryParams = {
    ...params,
    page: currentPage,
    limit: params.limit || 10,
    search: debouncedSearch || undefined,
    isFeatured: activeTab === "featured" ? true : undefined,
    hasDiscount: activeTab === "onSale" ? true : undefined,
    stockStatus:
      activeTab === "outOfStock" ? ("OUT_OF_STOCK" as const) : undefined,
    sortBy,
    sortOrder,
  };

  const { data, isFetching, isError, error, refetch } =
    useGetProductsQuery(queryParams);

  const totalPages = data?.pagination?.totalPages || 1;
  const pages = generatePagination(currentPage, totalPages);

  return {
    products: data?.data || [],
    pagination: data?.pagination,
    meta: data?.meta,
    isFetching,
    isError,
    error,
    refetch,
    currentPage,
    setCurrentPage,
    pages,
    tabs,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    queryParams,
    selectedIds,
    handleCheckboxChange: (id: string) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
      );
    },
    handleSelectAll: (ids: string[]) => {
      setSelectedIds(selectedIds.length === ids.length ? [] : ids);
    },
    resetSelection: () => setSelectedIds([]),
  };
}
