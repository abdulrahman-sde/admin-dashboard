// ============================================
// Generic API Response Types
// ============================================

/**
 * Standard API response structure
 * Used across all endpoints for consistent response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Paginated response structure
 * Used for list endpoints with pagination
 */
export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  message?: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string;
}

/**
 * Pagination parameters for requests
 */
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}
