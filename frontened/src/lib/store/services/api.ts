import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "Products",
    "Product",
    "Orders",
    "Order",
    "Customers",
    "Customer",
    "Categories",
    "Category",
    "Coupons",
    "Coupon",
    "Transactions",
    "Transaction",
    "Analytics",
    "Reviews",
    "PaymentMethods",
  ],

  endpoints: () => ({}),
});
