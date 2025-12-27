export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp?: string;
}

export interface PaginatedApiResponse<T> {
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message: string;
  success: boolean;
  timestamp?: string;
}

export interface PaginatedApiResponseWithMeta<T, M> {
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message: string;
  success: boolean;
  timestamp?: string;
  meta: M;
}

export interface ApiError {
  message: string;
  success: boolean;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

export interface CustomCursorProps {
  points?: { x: number; y: number }[];
  height?: number;
  offset?: { top: number };
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: { day: string }; value: number }[];
}
