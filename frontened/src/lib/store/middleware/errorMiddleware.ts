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

    // CASE A: Network Error / CORS / Server Down (FetchBaseQueryError)
    if (payload?.status === "FETCH_ERROR") {
      toast.error("Network Error", {
        description:
          "Please check your internet connection or try again later.",
      });
      return next(action);
    }

    // CASE B: Standard API Error (Your existing logic)
    const errorData = payload?.data; // Safely access data
    if (errorData) {
      // ... your existing validation logic ...
      if (errorData.message === "Validation error" && errorData.errors) {
        // ...
      } else {
        toast.error(errorData.message || "An error occurred", {
          description: `Status: ${payload.status || "Unknown"}`,
        });
      }
    } else {
      // CASE C: Unknown Error Shape
      toast.error("Something went wrong", {
        description: "An unexpected error occurred.",
      });
    }
  }

  return next(action);
};
