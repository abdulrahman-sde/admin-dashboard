import type { PaginatedApiResponse } from "./shared.types";

export type PaymentMethod = "CREDIT_CARD" | "PAYPAL" | "CASH" | "BANK_TRANSFER";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface TransactionCustomer {
  firstName: string;
  lastName: string;
  email: string;
}

export interface TransactionOrder {
  orderNumber: string;
  totalAmount: number;
  id?: string;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentStatus: TransactionStatus;
  paymentMethod: PaymentMethod;
  paymentGateway: string;
  createdAt: string;
  updatedAt: string;
  customer: TransactionCustomer;
  order: TransactionOrder;
  storePaymentMethod?: {
    id: string;
    name: string;
    type: string;
    last4: string;
  };
}

// For list view
export type TransactionListItem = Transaction;

export type GetAllTransactionsResponse = PaginatedApiResponse<
  TransactionListItem[]
>;

export interface GetTransactionResponse {
  success: boolean;
  timestamp: string;
  message: string;
  data: Transaction;
}

export interface TransactionsQuery {
  page?: number;
  limit?: number;
  search?: string;
  paymentStatus?: TransactionStatus;
  paymentMethod?: PaymentMethod;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
