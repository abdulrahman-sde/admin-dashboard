import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "../types/common.types.js";

const createBaseResponse = (
  success: boolean
): Pick<ApiResponse, "success" | "timestamp"> => ({
  success,
  timestamp: new Date().toISOString(),
});

export const successResponse = <T = unknown>(
  data: T,
  message = "Success"
): ApiResponse<T> => ({
  ...createBaseResponse(true),
  message,
  data,
});

export const paginatedResponse = <T>(
  data: T[],
  pagination: PaginationParams,
  message = "Success"
): PaginatedResponse<T> => ({
  ...createBaseResponse(true),
  data,
  pagination,
  message,
});

export const errorResponse = (
  message = "Operation failed",
  error?: unknown
): ApiResponse<null> => ({
  ...createBaseResponse(false),
  message,
  data: null,
  error: error instanceof Error ? error.message : error,
});
