import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";
import type { Middleware } from "@reduxjs/toolkit";

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as {
      status?: number | string;
      data?: { message?: string; errors?: unknown };
    };

    if (payload?.status === 401 || payload?.status === 403) {
      return next(action);
    }

    if (payload?.status === "FETCH_ERROR") {
      toast.error("Network Error", {
        description:
          "Cannot connect to the server. Please check if the backend is running.",
      });
      return next(action);
    }

    const errorData = payload?.data;
    if (errorData) {
      console.log(errorData);
    }
  }

  return next(action);
};
