import type { CreateOrderInput } from "../utils/validators/order.validator.js";

export type ServerOrderItem = {
  productId: string;
  quantity: number;
  unitPrice: number; // price fetched from DB
  totalPrice: number; // quantity * unitPrice
  productName?: string;
  productImage?: string;
  productSku?: string;
};

export type CreateOrderDTO = Omit<
  CreateOrderInput,
  "items" | "shippingFee" | "taxAmount" | "discount"
> & {
  items: ServerOrderItem[];
  shippingFee: number; // computed or default 0
  taxAmount: number; // computed or provided by tax calc
  discount: number; // computed/validated server-side
  subtotal: number; // sum of item totals
  totalAmount: number; // subtotal + shipping + tax - discount
};

export type OrderCreationResult = {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
};

export type OrderStatsFacetResult = {
  total: { count: number }[];
  pending: { count: number }[];
  delivered: { count: number }[];
  canceled: { count: number }[];
};

export type OrderStatsResult = {
  all: number;
  pending: number;
  delivered: number;
  canceled: number;
};
