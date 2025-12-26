import type { PaginatedApiResponse, ApiResponse } from "./shared.types";

export type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type CustomerRole = "GUEST" | "CUSTOMER" | "VIP";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  isGuest: boolean;
  role: CustomerRole;
}

export interface CustomerAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  fulfillmentStatus: string;
  totalAmount: number;
}

export interface CustomerDetail extends Customer {
  address?: CustomerAddress;
  notes?: string;
  tags?: string[];
  orders?: CustomerOrder[];
}

export type GetCustomersResponse = PaginatedApiResponse<Customer[]>;
export type GetCustomerResponse = ApiResponse<CustomerDetail>;

export interface CustomersQuery {
  page?: number;
  limit?: number;
  status?: CustomerStatus;
  role?: CustomerRole;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
