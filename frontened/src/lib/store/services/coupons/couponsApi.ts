import { api } from "../api";
import type {
  CouponsQuery,
  GetCouponsResponse,
  Coupon,
} from "@/types/coupons.types";
import type { AddCouponFormValues } from "@/schemas/coupon.schema";
import type { ApiResponse } from "@/types/shared.types";

export const couponsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query<GetCouponsResponse, CouponsQuery>({
      query: (params) => ({
        url: "/coupons",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((coupon) => ({
                type: "Coupon" as const,
                id: coupon.id,
              })),
              { type: "Coupon" as const, id: "LIST" },
            ]
          : [{ type: "Coupon" as const, id: "LIST" }],
    }),
    createCoupon: builder.mutation<ApiResponse<Coupon>, AddCouponFormValues>({
      query: (body) => ({
        url: "/coupons",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
    deleteCoupon: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Coupon", id },
        { type: "Coupon", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
} = couponsApi;
