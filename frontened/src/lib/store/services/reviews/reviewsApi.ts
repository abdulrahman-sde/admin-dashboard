import { api } from "../api";
import type { ApiResponse } from "@/types/shared.types";

export interface Review {
  id: string;
  productId: string;
  customerId?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  product?: {
    name: string;
    thumbnail: string;
  };
  customer?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface ReviewsResponse {
  status: string;
  data: Review[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const reviewsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query<
      ReviewsResponse,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/reviews",
        params,
      }),
      providesTags: ["Reviews"],
    }),
    getProductReviews: builder.query<
      ReviewsResponse,
      { productId: string; page?: number; limit?: number }
    >({
      query: ({ productId, ...params }) => ({
        url: `/reviews/product/${productId}`,
        params,
      }),
      providesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
      ],
    }),
    addReview: builder.mutation<ApiResponse<Review>, Partial<Review>>({
      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reviews", "Products"],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useGetProductReviewsQuery,
  useAddReviewMutation,
} = reviewsApi;
