import { api } from "./api";
import type {
  ReportsData,
  DemographicData,
  TopCustomer,
  TopProduct,
  ActiveSessions,
  DeviceAnalytics,
  ReportsQueryParams,
} from "@/types/reports";
import type { SuccessResponse } from "@/types/api";

export const reportsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getReportsData: build.query<ReportsData, ReportsQueryParams>({
      query: (params) => ({
        url: "/reports",
        params,
      }),
      transformResponse: (response: SuccessResponse<ReportsData>) =>
        response.data,
      providesTags: ["Reports"],
    }),
    getCustomerDemographics: build.query<DemographicData, void>({
      query: () => "/reports/demographics",
      transformResponse: (response: SuccessResponse<DemographicData>) =>
        response.data,
      providesTags: ["Reports"],
    }),
    getTopCustomers: build.query<TopCustomer[], { limit?: number }>({
      query: (params) => ({
        url: "/reports/top-customers",
        params,
      }),
      transformResponse: (response: SuccessResponse<TopCustomer[]>) =>
        response.data,
      providesTags: ["Reports", "Customers"],
    }),
    getTopProducts: build.query<TopProduct[], { limit?: number }>({
      query: (params) => ({
        url: "/reports/top-products",
        params,
      }),
      transformResponse: (response: SuccessResponse<TopProduct[]>) =>
        response.data,
      providesTags: ["Reports", "Products"],
    }),
    getActiveSessions: build.query<ActiveSessions, void>({
      query: () => "/reports/active-sessions",
      transformResponse: (response: SuccessResponse<ActiveSessions>) =>
        response.data,
      providesTags: ["Reports"],
    }),
    getDeviceAnalytics: build.query<DeviceAnalytics, ReportsQueryParams>({
      query: (params) => ({
        url: "/reports/device-analytics",
        params,
      }),
      transformResponse: (response: SuccessResponse<DeviceAnalytics>) =>
        response.data,
      providesTags: ["Reports"],
    }),
  }),
});

export const {
  useGetReportsDataQuery,
  useGetCustomerDemographicsQuery,
  useGetTopCustomersQuery,
  useGetTopProductsQuery,
  useGetActiveSessionsQuery,
  useGetDeviceAnalyticsQuery,
} = reportsApi;
