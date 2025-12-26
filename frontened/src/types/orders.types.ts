import type { PaginatedApiResponse } from "./shared.types";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED"
  | "COMPLETED"; // Added COMPLETED as it might be used in tabs
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface OrderItem {
  productName: string;
  productImage?: string;
  quantity: number;
}

// For list view
export interface OrderListItem {
  id: string;
  orderNumber: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: OrderStatus;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
}

export type GetOrdersResponse = PaginatedApiResponse<OrderListItem[]> & {
  meta?: {
    all: number;
    pending: number;
    completed: number;
    canceled: number;
  };
};

export interface OrdersQuery {
  page?: number;
  limit?: number;
  fulfillmentStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}
