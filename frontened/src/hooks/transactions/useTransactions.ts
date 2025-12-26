import { useState, useEffect } from "react";
import { useGetAllTransactionsQuery } from "@/lib/store/services/transactions/transactionsApi";
import { useGetAnalytics } from "@/hooks/analytics/useGetAnalytics";
import type { TransactionStatus } from "@/types/transaction.types";
import { generatePagination } from "@/lib/utils";

export const useTransactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<TransactionStatus | undefined>(
    undefined
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    "desc"
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isFetching, isError, error } = useGetAllTransactionsQuery({
    page: currentPage,
    limit: 10,
    paymentStatus: status,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  });

  const {
    stats,
    weeklySalesChange,
    isFetching: isFetchingAnalytics,
  } = useGetAnalytics();

  const totalPages = data?.pagination?.totalPages || 1;
  const totalTransactions = data?.pagination?.total || 0;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleTabChange = (tab: string) => {
    setCurrentPage(1);
    if (tab === "all") {
      setStatus(undefined);
    } else if (tab === "paid") {
      setStatus("COMPLETED");
    } else if (tab === "pending") {
      setStatus("PENDING");
    } else if (tab === "failed") {
      setStatus("FAILED");
    }
  };

  const setPaymentStatus = (newStatus: TransactionStatus | undefined) => {
    setCurrentPage(1);
    setStatus(newStatus);
  };

  const activeTab = !status
    ? "all"
    : status === "COMPLETED"
    ? "paid"
    : status === "PENDING"
    ? "pending"
    : status === "FAILED"
    ? "failed"
    : "all";

  const pages = generatePagination(currentPage, totalPages);

  // Helper to calculate percentage of total
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  // Get dynamic stats using analytics data
  const getDynamicStats = () => {
    const transactionStats = stats?.transactions?.thisWeek;
    const orderStats = stats?.orders?.thisWeek;

    if (!transactionStats || !orderStats) {
      return [
        {
          title: "Total Revenue",
          value: 0,
          change: { value: 0, isPositive: true },
          subtitle: "Last 7 days",
        },
        {
          title: "Completed Transactions",
          value: 0,
          change: { value: 0, isPositive: true },
          subtitle: "Last 7 days",
        },
        {
          title: "Pending Transactions",
          value: 0,
          change: { value: 0, isPositive: true },
          subtitle: "Last 7 days",
        },
        {
          title: "Failed Transactions",
          value: 0,
          change: { value: 0, isPositive: false },
          subtitle: "Last 7 days",
        },
      ];
    }

    const totalTransactionsAll =
      transactionStats.completedTransactions +
      transactionStats.pendingTransactions +
      transactionStats.failedTransactions;

    return [
      {
        title: "Total Revenue",
        value: orderStats.totalSales,
        change: {
          value: Math.abs(weeklySalesChange),
          isPositive: weeklySalesChange > 0,
        },
        subtitle: "Last 7 days",
      },
      {
        title: "Completed Transactions",
        value: transactionStats.completedTransactions,
        change: {
          value: calculatePercentage(
            transactionStats.completedTransactions,
            totalTransactionsAll
          ),
          isPositive: true,
        },
        subtitle: "Last 7 days",
      },
      {
        title: "Pending Transactions",
        value: transactionStats.pendingTransactions,
        change: {
          value: calculatePercentage(
            transactionStats.pendingTransactions,
            totalTransactionsAll
          ),
          isPositive: true,
        },
        subtitle: "Last 7 days",
      },
      {
        title: "Failed Transactions",
        value: transactionStats.failedTransactions,
        change: {
          value: calculatePercentage(
            transactionStats.failedTransactions,
            totalTransactionsAll
          ),
          isPositive: false,
        },
        subtitle: "Last 7 days",
      },
    ];
  };

  return {
    transactions: data?.data || [],
    isFetching: isFetching || isFetchingAnalytics,
    isError,
    pagination: data?.pagination,
    error,
    currentPage,
    setCurrentPage: handlePageChange,
    totalPages,
    totalTransactions,
    search,
    setSearch: handleSearchChange,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    paymentStatus: status,
    setPaymentStatus,
    pages,
    handleTabChange,
    activeTab,
    dynamicStats: getDynamicStats(),
  };
};
