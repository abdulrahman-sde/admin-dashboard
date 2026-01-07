import { useState } from "react";
import type { Transaction } from "@/types/transaction.types";
import { useTransactions } from "@/hooks/transactions/useTransactions";

export function useTransactionHistory() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const transactionsData = useTransactions();

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const toggleSort = (field: string) => {
    if (transactionsData.sortBy === field) {
      transactionsData.setSortOrder(
        transactionsData.sortOrder === "asc" ? "desc" : "asc"
      );
    } else {
      transactionsData.setSortBy(field);
      transactionsData.setSortOrder("desc");
    }
  };

  const formatMethod = (method: string) => {
    if (method === "CREDIT_CARD") return "CC";
    if (method === "PAYPAL") return "PayPal";
    if (method === "BANK_TRANSFER") return "Bank";
    return method
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  return {
    ...transactionsData,
    selectedTransaction,
    modalOpen,
    setModalOpen,
    handleViewDetails,
    toggleSort,
    formatMethod,
  };
}
