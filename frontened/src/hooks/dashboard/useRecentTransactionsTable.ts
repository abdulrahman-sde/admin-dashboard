import { useState } from "react";
import { useTransactions } from "@/hooks/transactions";
import { useNavigate } from "react-router";

export function useRecentTransactionsTable() {
  const { transactions, isFetching, setPaymentStatus, paymentStatus } =
    useTransactions();
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const handleFilterToggle = () => setShowFilter((s) => !s);

  const applyFilter = (
    status: "COMPLETED" | "PENDING" | "FAILED" | undefined
  ) => {
    setPaymentStatus(status);
    setShowFilter(false);
  };

  const navigateToDetails = () => navigate("/dashboard/transactions");

  return {
    transactions: transactions.slice(0, 6),
    isFetching,
    paymentStatus,
    showFilter,
    handleFilterToggle,
    applyFilter,
    navigateToDetails,
  };
}
