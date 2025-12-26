import { useState, useEffect } from "react";
import { ordersApi } from "@/lib/store/services/orders/ordersApi";
import { useGetAnalytics } from "@/hooks/analytics/useGetAnalytics";
import type { OrderStatus, PaymentStatus } from "@/types/orders.types";

export const useOrders = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | undefined>(
    undefined
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isFetching, isError, error } = ordersApi.useGetAllOrdersQuery({
    page,
    limit: 10,
    fulfillmentStatus: status,
    paymentStatus,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  });

  const {
    stats,
    weeklyOrdersChange,
    isFetching: isFetchingAnalytics,
  } = useGetAnalytics();

  const totalPages = data?.pagination?.totalPages || 1;
  const totalOrders = data?.pagination?.total || 0;

  // Generate page numbers for pagination with ellipses
  const getPages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 6; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page > totalPages - 4) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 5; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Get counts by status for tabs
  const getStatusCounts = () => {
    if (data?.meta) {
      return {
        all: data.meta.all,
        completed: data.meta.completed,
        pending: data.meta.pending,
        cancelled: data.meta.canceled,
      };
    }
    return {
      all: totalOrders,
      completed: 0,
      pending: 0,
      cancelled: 0,
    };
  };

  const handleTabChange = (tab: string) => {
    setPage(1);
    if (tab === "all") {
      setStatus(undefined);
    } else if (tab === "completed") {
      setStatus("DELIVERED");
    } else if (tab === "pending") {
      setStatus("PENDING");
    } else if (tab === "canceled") {
      setStatus("CANCELED");
    }
  };

  const activeTab = !status
    ? "all"
    : status === "COMPLETED" || status === "DELIVERED"
    ? "completed"
    : status === "PENDING"
    ? "pending"
    : status === "CANCELED"
    ? "canceled"
    : "all";

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // Helper to calculate percentage of total
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  // Get dynamic stats for the top cards using analytics data
  const getDynamicStats = () => {
    const orderStats = stats?.orders?.thisWeek;
    if (!orderStats) {
      return [
        {
          title: "Total Orders",
          value: 0,
          change: { value: 0, isPositive: true },
          subtitle: "Last 7 days",
        },
        {
          title: "New Orders",
          value: 0,
          change: { value: 0, isPositive: true },
          subtitle: "Last 7 days",
        },
        {
          title: "Completed Orders",
          value: 0,
          change: { value: 0, isPositive: true },
          subtitle: "Last 7 days",
        },
        {
          title: "Canceled Orders",
          value: 0,
          change: { value: 0, isPositive: true },
          subtitle: "Last 7 days",
        },
      ];
    }

    return [
      {
        title: "Total Orders",
        value: orderStats.totalOrders,
        change: {
          value: Math.abs(weeklyOrdersChange),
          isPositive: weeklyOrdersChange > 0,
        },
        subtitle: "Last 7 days",
      },
      {
        title: "New Orders",
        value: orderStats.newOrders,
        change: {
          value: calculatePercentage(
            orderStats.newOrders,
            orderStats.totalOrders
          ),
          isPositive: true,
        },
        subtitle: "Last 7 days",
      },
      {
        title: "Completed Orders",
        value: orderStats.completedOrders,
        change: {
          value: calculatePercentage(
            orderStats.completedOrders,
            orderStats.totalOrders
          ),
          isPositive: true,
        },
        subtitle: "Last 7 days",
      },
      {
        title: "Canceled Orders",
        value: orderStats.cancelledOrders,
        change: {
          value: calculatePercentage(
            orderStats.cancelledOrders,
            orderStats.totalOrders
          ),
          isPositive: false,
        },
        subtitle: "Last 7 days",
      },
    ];
  };

  return {
    orders: data?.data || [],
    pagination: data?.pagination,
    meta: data?.meta,
    isFetching: isFetching || isFetchingAnalytics,
    isError,
    error,
    currentPage: page,
    setCurrentPage: setPage,
    totalPages,
    totalOrders,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
    search,
    setSearch: handleSearchChange,
    pages: getPages(),
    statusCounts: getStatusCounts(),
    handleTabChange,
    activeTab,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    dynamicStats: getDynamicStats(),
  };
};
