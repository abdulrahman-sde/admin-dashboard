import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category Name is required"),
  image: z.any().optional(),
  visibility: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
