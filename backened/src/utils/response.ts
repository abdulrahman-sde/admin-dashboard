import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "../types/common.types.js";

// ============================================
// Base Response Builder
// ============================================

const createBaseResponse = (
  success: boolean
): Pick<ApiResponse, "success" | "timestamp"> => ({
  success,
  timestamp: new Date().toISOString(),
});

// ============================================
// Success Responses
// ============================================

export const successResponse = <T = any>(
  data: T,
  message = "Success"
): ApiResponse<T> => ({
  ...createBaseResponse(true),
  message,
  data,
});

// ============================================
// Paginated Responses
// ============================================

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

// ============================================
// Error Responses
// ============================================

export const errorResponse = (
  message = "Operation failed",
  error?: any
): ApiResponse<null> => ({
  ...createBaseResponse(false),
  message,
  data: null,
  error: error?.message || error,
});
