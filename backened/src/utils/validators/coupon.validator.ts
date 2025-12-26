import { z } from "zod";
import { paginationSchema, enumField } from "./helpers.js";

// ============================================
// Shared Enums
// ============================================
export const CouponTypeEnum = z.enum([
  "FIXED",
  "PERCENTAGE",
  "FREE_SHIPPING",
  "PRICE_DISCOUNT",
]);
export const CouponStatusEnum = z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]);

// ============================================
// Create Coupon Schema
// ============================================
export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Code must be alphanumeric (hyphens/underscores allowed)"
    ),
  name: z.string().min(1, "Name is required"),

  type: CouponTypeEnum,
  value: z.number().min(0).default(0), // 0 for free shipping usually

  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),

  usageLimit: z.number().int().positive().optional().nullable(),
  status: CouponStatusEnum.default("ACTIVE"),

  appliesTo: z.any().optional(), // Flexible JSON
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;

// ============================================
// Update Coupon Schema
// ============================================
export const updateCouponSchema = createCouponSchema.partial().extend({
  // Can explicitly set usageLimit or endDate to null to remove limits
  usageLimit: z.number().int().positive().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
});

export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;

// ============================================
// Query Schema
// ============================================
export const getCouponsQuerySchema = paginationSchema.extend({
  search: z.string().optional(),

  status: CouponStatusEnum.optional(),
  type: CouponTypeEnum.optional(),

  sortBy: enumField(
    ["createdAt", "startDate", "endDate", "usageCount"],
    "Sort By"
  ).default("createdAt"),
  sortOrder: enumField(["asc", "desc"], "Sort Order").default("desc"),
});

export type GetCouponsQuery = z.infer<typeof getCouponsQuerySchema>;

// Bulk delete validator
export const bulkDeleteCouponsSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export type BulkDeleteCouponsInput = z.infer<typeof bulkDeleteCouponsSchema>;
