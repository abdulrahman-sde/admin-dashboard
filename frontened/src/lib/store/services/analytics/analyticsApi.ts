import type { GetAnalyticsResponse } from "@/types/analytics.types";
import { api } from "../api";

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTwoWeekStats: builder.query<GetAnalyticsResponse, void>({
      query: () => "analytics/two-week-stats",
      providesTags: [{ type: "Analytics", id: "LIST" }],
    }),
  }),
});

export const { useGetTwoWeekStatsQuery } = analyticsApi;
