import { api } from "../api";
import type { ProductsQueryParams } from "@/types/products.types";
import type { GetProductsResponse, Product } from "@/types/products.types";
import type { ApiResponse } from "@/types/shared.types";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/schemas/product.schema";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with filters

    getProducts: builder.query<GetProductsResponse, ProductsQueryParams>({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Product" as const,
                id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // Get single product

    getProduct: builder.query<ApiResponse<Product>, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    // Add product

    addProduct: builder.mutation<ApiResponse<Product>, CreateProductInput>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    // Update product

    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: string } & Partial<UpdateProductInput>
    >({
      query: ({ id, ...body }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Product", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    // Bulk delete products
    bulkDeleteProducts: builder.mutation<ApiResponse<null>, string[]>({
      query: (ids) => ({
        url: "/products/bulk-delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    // Update product stock
    updateProductStock: builder.mutation<
      ApiResponse<Product>,
      { id: string; stock: number }
    >({
      query: ({ id, stock }) => ({
        url: `/products/${id}/stock`,
        method: "PATCH",
        body: { stock },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Product", id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBulkDeleteProductsMutation,
  useUpdateProductStockMutation,
} = productsApi;
