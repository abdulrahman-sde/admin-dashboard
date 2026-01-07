import { getTransactionStatusColor } from "@/lib/utils";
import type { Transaction } from "@/types/transaction.types";

export function useTransactionDetails(transaction: Transaction | null) {
  const formatMethod = (method: string) => {
    return method
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const statusColorClass = transaction
    ? getTransactionStatusColor(transaction.paymentStatus)
    : "";

  return {
    formatMethod,
    statusColorClass,
  };
}
