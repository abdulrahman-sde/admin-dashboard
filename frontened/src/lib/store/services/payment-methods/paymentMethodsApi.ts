import { api } from "../api";

import type {
  StorePaymentMethod,
  PaymentMethodsResponse,
} from "@/types/payment-method.types";

export const paymentMethodsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethodsResponse, void>({
      query: () => "/payment-methods",
      providesTags: ["PaymentMethods"],
    }),
    createPaymentMethod: builder.mutation<any, Partial<StorePaymentMethod>>({
      query: (body) => ({
        url: "/payment-methods",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
    updatePaymentMethod: builder.mutation<
      any,
      { id: string; body: Partial<StorePaymentMethod> }
    >({
      query: ({ id, body }) => ({
        url: `/payment-methods/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
    deletePaymentMethod: builder.mutation<any, string>({
      query: (id) => ({
        url: `/payment-methods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentMethodsApi;
