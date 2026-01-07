import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRelevantTransactions } from "@/hooks/transactions/useRelevantTransactions";
import { Loader2, Receipt } from "lucide-react";
import { getTransactionStatusColor, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface RelevantTransactionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storePaymentMethodId?: string;
}

export function RelevantTransactionsModal({
  open,
  onOpenChange,
  storePaymentMethodId,
}: RelevantTransactionsModalProps) {
  const { transactions, isLoading } = useRelevantTransactions({
    storePaymentMethodId,
    open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] border-none shadow-2xl overflow-hidden flex flex-col max-h-[80vh] p-0">
        <DialogHeader className="p-6 bg-linear-to-r from-primary/5 to-transparent border-b border-gray-100 shrink-0">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Transactions
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">
              No transactions found for this payment method.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50/50 sticky top-0 z-10">
                <TableRow className="border-b border-gray-100">
                  <TableHead className="ps-8">Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="font-medium ps-8">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">
                          {tx.customer.firstName} {tx.customer.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {tx.customer.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      ${tx.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center pr-6">
                      <Badge
                        variant="outline"
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold border-transparent uppercase tracking-wide",
                          getTransactionStatusColor(tx.paymentStatus),
                          tx.paymentStatus === "COMPLETED" &&
                            "bg-green-50 text-green-700",
                          tx.paymentStatus === "FAILED" &&
                            "bg-red-50 text-red-700",
                          tx.paymentStatus === "PENDING" &&
                            "bg-yellow-50 text-yellow-700"
                        )}
                      >
                        {tx.paymentStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
