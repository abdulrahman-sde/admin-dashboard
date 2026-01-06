import { api } from "../api";
import type { SearchResponse } from "@/types/search.types";

export const searchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<SearchResponse, string>({
      query: (q) => ({
        url: "/search",
        params: { q },
      }),
    }),
  }),
});

export const { useSearchQuery, useLazySearchQuery } = searchApi;
