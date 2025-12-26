import { api } from "../api";
import type { OrdersQuery, GetOrdersResponse } from "@/types/orders.types";

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<GetOrdersResponse, OrdersQuery>({
      query: ({
        page = 1,
        limit = 10,
        fulfillmentStatus,
        paymentStatus,
        search,
        sortBy,
        sortOrder,
        startDate,
        endDate,
      }) => ({
        url: "/orders",
        method: "GET",
        params: {
          page,
          limit,
          fulfillmentStatus,
          paymentStatus,
          search,
          sortBy,
          sortOrder,
          startDate,
          endDate,
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((order) => ({
                type: "Order" as const,
                id: order.id,
              })),
              { type: "Order" as const, id: "LIST" },
            ]
          : [{ type: "Order" as const, id: "LIST" }],
    }),
  }),
});

export const { useGetAllOrdersQuery } = ordersApi;
