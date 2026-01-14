import { api } from "../api";

import type {
  StorePaymentMethod,
  PaymentMethodsResponse,
} from "@/types/payment-method.types";
import type { ApiResponse } from "@/types/shared.types";

export const paymentMethodsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethodsResponse, void>({
      query: () => "/payment-methods",
      providesTags: ["PaymentMethods"],
    }),
    createPaymentMethod: builder.mutation<
      ApiResponse<StorePaymentMethod>,
      Partial<StorePaymentMethod>
    >({
      query: (body) => ({
        url: "/payment-methods",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
    updatePaymentMethod: builder.mutation<
      ApiResponse<StorePaymentMethod>,
      { id: string; body: Partial<StorePaymentMethod> }
    >({
      query: ({ id, body }) => ({
        url: `/payment-methods/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
    deletePaymentMethod: builder.mutation<ApiResponse<null>, string>({
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
