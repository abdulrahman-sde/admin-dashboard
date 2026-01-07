import { useGetAllTransactionsQuery } from "@/lib/store/services/transactions/transactionsApi";

interface UseRelevantTransactionsProps {
  storePaymentMethodId?: string;
  open: boolean;
}

export function useRelevantTransactions({
  storePaymentMethodId,
  open,
}: UseRelevantTransactionsProps) {
  const { data, isLoading } = useGetAllTransactionsQuery(
    {
      page: 1,
      limit: 50,
      storePaymentMethodId,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    { skip: !open || !storePaymentMethodId }
  );

  const transactions = data?.data || [];

  return {
    transactions,
    isLoading,
  };
}
