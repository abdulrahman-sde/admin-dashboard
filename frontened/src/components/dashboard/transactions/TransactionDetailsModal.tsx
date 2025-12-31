import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  CreditCard,
  User,
  Hash,
  Calendar,
  DollarSign,
  Activity,
  Receipt,
} from "lucide-react";
import type { TransactionDetailsModalProps } from "@/types/transaction.types";
import { Separator } from "@/components/ui/separator";
import { getTransactionStatusColor, cn } from "@/lib/utils";

export function TransactionDetailsModal({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

  const formatMethod = (method: string) => {
    return method
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const statusColorClass = getTransactionStatusColor(transaction.paymentStatus);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-linear-to-r from-primary/5 to-transparent border-b border-gray-100 pr-12">
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Transaction Details
            </DialogTitle>
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1 rounded-full font-semibold border-current",
                statusColorClass,
                transaction.paymentStatus === "COMPLETED" && "bg-green-50",
                transaction.paymentStatus === "FAILED" && "bg-red-50",
                transaction.paymentStatus === "PENDING" && "bg-yellow-50",
                transaction.paymentStatus === "REFUNDED" && "bg-blue-50"
              )}
            >
              {transaction.paymentStatus}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Reference ID: {transaction.transactionNumber}
          </p>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-3 w-3" />
                Amount
              </label>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">
                ${transaction.amount.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Date & Time
              </label>
              <p className="text-sm font-semibold text-gray-700">
                {format(new Date(transaction.createdAt), "PPP p")}
              </p>
            </div>
          </div>

          <Separator className="bg-gray-100" />

          {/* Customer & Payment Info */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <User className="h-4 w-4 text-primary" />
                Customer
              </h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {transaction.customer.firstName}{" "}
                    {transaction.customer.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.customer.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                    ID: {transaction.customerId.slice(-6)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment
              </h4>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">
                  {formatMethod(transaction.paymentMethod)}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3" />
                  Gateway: {transaction.paymentGateway}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  Order Number
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                #{transaction.order.orderNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  Order Total
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                ${transaction.order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
