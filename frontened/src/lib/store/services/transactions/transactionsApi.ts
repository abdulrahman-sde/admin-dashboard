import { api } from "../api";
import type {
  GetAllTransactionsResponse,
  GetTransactionResponse,
  TransactionsQuery,
} from "@/types/transaction.types";

export const transactionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query<
      GetAllTransactionsResponse,
      TransactionsQuery
    >({
      query: (params) => ({
        url: "/transactions",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Transaction" as const,
                id,
              })),
              { type: "Transactions", id: "LIST" },
            ]
          : [{ type: "Transactions", id: "LIST" }],
    }),
    getTransactionById: builder.query<GetTransactionResponse, string>({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Transaction", id }],
    }),
  }),
});

export const { useGetAllTransactionsQuery, useGetTransactionByIdQuery } =
  transactionsApi;
