import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
  customerId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid customer ID")
    .optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
