import type { CategoriesResponse, Category } from "@/types/categories.types";
import type { CategoryFormValues } from "@/schemas/category.schema";
import type { ApiResponse } from "@/types/shared.types";
import { api } from "../api";

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "/categories",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Category" as const,
                id,
              })),
              { type: "Categories", id: "LIST" },
            ]
          : [{ type: "Categories", id: "LIST" }],
    }),
    getCategory: builder.query<ApiResponse<Category>, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<ApiResponse<Category>, CategoryFormValues>(
      {
        query: (body) => ({
          url: "/categories",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "Categories", id: "LIST" }],
      }
    ),
    updateCategory: builder.mutation<
      ApiResponse<Category>,
      { id: string } & Partial<CategoryFormValues>
    >({
      query: ({ id, ...body }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        { type: "Categories", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi;
