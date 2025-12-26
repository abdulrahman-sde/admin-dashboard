import { useState, useEffect } from "react";
import { couponsApi } from "@/lib/store/services/coupons/couponsApi";
import type { CouponStatus } from "@/types/coupons.types";
import { generatePagination } from "@/lib/utils";

export const useCoupons = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<CouponStatus | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "startDate" | "endDate" | "usageCount" | undefined
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    "desc"
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isFetching, isError, error } = couponsApi.useGetAllCouponsQuery(
    {
      page,
      limit: 10,
      status,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder,
    }
  );

  const totalPages = data?.pagination?.totalPages || 1;
  const pages = generatePagination(page, totalPages);

  return {
    coupons: data?.data || [],
    pagination: data?.pagination,
    isFetching,
    isError,
    error,
    currentPage: page,
    setCurrentPage: setPage,
    status,
    setStatus,
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    pages,
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
};
