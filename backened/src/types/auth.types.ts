import type { Request } from "express";
import type { User, UserRole, Customer } from "@prisma/client";
import type { ApiResponse, PaginatedResponse } from "./common.types.js";


export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: UserRole;
  };
}



export type SafeUser = Omit<User, "password">;
export type SafeCustomer = Omit<Customer, "password">;

export interface TokenResponse<T = any> {
  data: T;
  accessToken: string;
  refreshToken: string;
}

export type UserAuthResponse = TokenResponse<SafeUser>;


export interface UserJWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  type: "admin";
}

export type JWTPayload = UserJWTPayload;

export type { ApiResponse, PaginatedResponse };
