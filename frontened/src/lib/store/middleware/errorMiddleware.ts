// lib/store/middleware/errorMiddleware.ts
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";
import type { Middleware } from "@reduxjs/toolkit";

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  // 1. Check if it's a rejected endpoint
  if (isRejectedWithValue(action)) {
    const payload = action.payload as {
      status?: number | string;
      data?: { message?: string; errors?: unknown };
    };

    // CASE A: Forbidden or Unauthorized (Expected states, handle in UI)
    if (payload?.status === 401 || payload?.status === 403) {
      return next(action);
    }

    // CASE B: Network Error / CORS / Server Down
    if (payload?.status === "FETCH_ERROR") {
      toast.error("Network Error", {
        description:
          "Cannot connect to the server. Please check if the backend is running.",
      });
      return next(action);
    }

    // CASE C: API Error Response
    const errorData = payload?.data as any;
    if (errorData) {
      const message = errorData.message || "An error occurred";

      // Don't toast for common internal validation/auth messages if we handle them in forms
      if (message !== "No token provided" && message !== "JWT expired") {
        toast.error(message);
      }
    } else {
      // CASE D: Unknown Error Shape
      toast.error("Something went wrong", {
        description: "An unexpected error occurred.",
      });
    }
  }

  return next(action);
};
