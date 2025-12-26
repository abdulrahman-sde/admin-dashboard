import type { CustomerFormValues } from "@/schemas/customer.schema";
import { api } from "../api";
import type {
  CustomersQuery,
  GetCustomersResponse,
  GetCustomerResponse,
  Customer,
} from "@/types/customers.types";
import type { ApiResponse } from "@/types/shared.types";

export const customersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query<GetCustomersResponse, CustomersQuery>({
      query: ({
        page = 1,
        limit = 10,
        status,
        role,
        search,
        sortBy,
        sortOrder,
      }) => ({
        url: "/customers",
        method: "GET",
        params: {
          page,
          limit,
          status,
          role,
          search,
          sortBy,
          sortOrder,
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((customer) => ({
                type: "Customer" as const,
                id: customer.id,
              })),
              { type: "Customer" as const, id: "LIST" },
            ]
          : [{ type: "Customer" as const, id: "LIST" }],
    }),
    getCustomerById: builder.query<GetCustomerResponse, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Customer", id }],
    }),
    addCustomer: builder.mutation<ApiResponse<Customer>, CustomerFormValues>({
      query: (body) => ({
        url: "/customers",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
    updateCustomer: builder.mutation<
      ApiResponse<Customer>,
      { id: string; body: Partial<CustomerFormValues> }
    >({
      query: ({ id, body }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),
    deleteCustomer: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi;
