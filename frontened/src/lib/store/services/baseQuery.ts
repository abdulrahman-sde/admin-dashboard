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
    const url = typeof args === "string" ? args : args.url;

    // Only try to refresh if it's NOT an auth-related endpoint already
    // (except /me, which is the one we want to recover)
    // Actually, if it IS /me, we should try to refresh.
    // If it is /refresh and it failed, we definitely shouldn't retry.

    if (url?.includes("/auth/refresh")) {
      return result;
    }

    console.log("JWT expired or missing, attempting refresh...");

    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      console.log("Token refreshed successfully");
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("Refresh failed, session ended");
      // Let the UI (AuthInitializer or hooks) handle the state
    }
  }

  return result;
};
