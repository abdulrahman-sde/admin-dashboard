import { z } from "zod";

export const addCouponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters"),
  name: z.string().min(3, "Coupon name must be at least 3 characters"),
  type: z.enum(["FIXED", "PERCENTAGE", "FREE_SHIPPING", "PRICE_DISCOUNT"]),
  value: z.number().min(0, "Value must be 0 or greater"),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  durationDays: z.number().optional().nullable(),
  usageLimit: z.number().optional().nullable(),
  // coupon applies globally by default
  noEndDate: z.boolean(),
  noUsageLimit: z.boolean(),
});

export type AddCouponFormValues = z.infer<typeof addCouponSchema>;
