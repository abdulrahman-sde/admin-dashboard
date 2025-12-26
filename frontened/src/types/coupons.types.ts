import type { PaginatedApiResponse } from "./shared.types";

export type CouponType =
  | "FREE_SHIPPING"
  | "FIXED"
  | "PERCENTAGE"
  | "PRICE_DISCOUNT";
export type CouponStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

export interface CouponAppliesTo {
  minOrderValue?: number;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  type: CouponType;
  value: number;
  startDate: string;
  endDate: string | null;
  usageLimit: number | null;
  usageCount: number;
  status: CouponStatus;
  appliesTo: CouponAppliesTo | null;
  createdAt: string;
  updatedAt: string;
}

export type GetCouponsResponse = PaginatedApiResponse<Coupon[]>;

export interface CouponsQuery {
  page?: number;
  limit?: number;
  status?: CouponStatus;
  type?: CouponType;
  search?: string;
  sortBy?: "createdAt" | "startDate" | "endDate" | "usageCount";
  sortOrder?: "asc" | "desc";
}

export type AppliesTo = "ALL" | "SPECIFIC_PRODUCTS" | "SPECIFIC_CATEGORIES";
