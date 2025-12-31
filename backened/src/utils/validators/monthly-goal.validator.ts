import { z } from "zod";

export const createMonthlyGoalSchema = z.object({
  month: z
    .string()
    .regex(/^[0-9]{4}-[0-9]{2}$/, "Month must be in YYYY-MM format"),
  goalAmount: z.number().nonnegative(),
  createdBy: z.string().optional(),
});

export type CreateMonthlyGoalInput = z.infer<typeof createMonthlyGoalSchema>;
