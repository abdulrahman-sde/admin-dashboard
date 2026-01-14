import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category Name is required"),
  image: z.union([z.string(), z.instanceof(File)]).optional(),
  visibility: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
