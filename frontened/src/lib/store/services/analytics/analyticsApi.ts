import type {
  GetAnalyticsResponse,
  GetDetailedDailyMetricsResponse,
  GetReportsResponse,
  RealTimeStatsResponse,
} from "@/types/analytics.types";
import { api } from "../api";

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTwoWeekStats: builder.query<GetAnalyticsResponse, void>({
      query: () => "analytics/two-week-stats",
      providesTags: [{ type: "Analytics", id: "LIST" }],
    }),
    getDetailedDailyMetrics: builder.query<
      GetDetailedDailyMetricsResponse,
      void
    >({
      query: () => "analytics/detailed-daily-metrics",
      providesTags: [{ type: "Analytics", id: "LIST" }],
    }),
    getReports: builder.query<
      GetReportsResponse,
      { startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({
        url: "analytics/reports",
        params: params || {},
      }),
      providesTags: [{ type: "Analytics", id: "LIST" }],
    }),
    getRealTimeStats: builder.query<RealTimeStatsResponse, void>({
      query: () => "analytics/real-time",
      providesTags: [{ type: "Analytics", id: "REALTIME" }],
    }),
  }),
});

export const {
  useGetTwoWeekStatsQuery,
  useGetDetailedDailyMetricsQuery,
  useGetReportsQuery,
  useGetRealTimeStatsQuery,
} = analyticsApi;
