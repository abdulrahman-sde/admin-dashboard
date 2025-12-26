// services/baseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/admin";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("JWT expired, refreshing...");

    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      console.log("Token refreshed");
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("Refresh failed, redirecting to login");
      window.location.href = "/login";
    }
  }

  return result;
};
