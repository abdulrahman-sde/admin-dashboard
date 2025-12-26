import { z } from "zod";

// Create Category Schema
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be at most 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),
  visibility: z.boolean().optional(),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// Update Category Schema
export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be at most 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    )
    .optional(),
  image: z.string().url("Image must be a valid URL").optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
});

// Query Parameters Schema
export const categoryQuerySchema = z.object({});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
