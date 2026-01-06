import type { Request } from "express";
import type { User, UserRole, Customer } from "@prisma/client";
import type { ApiResponse, PaginatedResponse } from "./common.types.js";

// ============================================
// Request Extensions (Generic)
// ============================================

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: UserRole;
  };
}

// ============================================
// Authentication Types
// ============================================

// Note: LoginInput and RegisterInput are exported from validators/auth.validator.ts
// as Zod-inferred types. Use those for request validation.

// Omit sensitive fields from models
export type SafeUser = Omit<User, "password">;
export type SafeCustomer = Omit<Customer, "password">;

// Generic token response - works for ANY entity
export interface TokenResponse<T = any> {
  data: T;
  accessToken: string;
  refreshToken: string;
}

// Specific implementations (for convenience)
export type UserAuthResponse = TokenResponse<SafeUser>;

// ============================================
// JWT Payload Types
// ============================================

/**
 * Admin User JWT Payload
 */
export interface UserJWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  type: "admin";
}

export type JWTPayload = UserJWTPayload;

// Re-export common types for convenience
export type { ApiResponse, PaginatedResponse };
