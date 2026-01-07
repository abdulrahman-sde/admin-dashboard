export interface SuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: unknown;
}
