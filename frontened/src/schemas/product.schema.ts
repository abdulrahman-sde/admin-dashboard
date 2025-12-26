import { z } from "zod";

// ============================================
// Form Schema (used for UI state)
// ============================================

export const productSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().positive("Price must be positive"),
    discountPrice: z.coerce.number().positive().optional().or(z.literal(0)),
    stockQuantity: z.coerce.number().int().min(0).optional(),
    isUnlimitedStock: z.boolean().default(false),
    categoryId: z
      .string()
      .min(1, "Category ID is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format"),
    tagId: z.string().optional(),
    colors: z.array(z.string()).optional(),
    images: z.array(z.any()).min(1, "At least one image is required"),
    isFeatured: z.boolean().default(false),
    expirationStart: z.date().optional(),
    expirationEnd: z.date().optional(),
  })
  .refine(
    (data) => {
      if (!data.isUnlimitedStock) {
        return data.stockQuantity !== undefined && data.stockQuantity >= 0;
      }
      return true;
    },
    {
      message: "Stock quantity is required when stock is not unlimited",
      path: ["stockQuantity"],
    }
  )
  .refine(
    (data) => {
      if (data.discountPrice && data.discountPrice >= data.price) {
        return false;
      }
      return true;
    },
    {
      message: "Discounted price must be less than the regular price",
      path: ["discountPrice"],
    }
  )
  .refine(
    (data) => {
      if (data.expirationStart && data.expirationEnd) {
        return data.expirationEnd > data.expirationStart;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["expirationEnd"],
    }
  );

export type ProductFormValues = z.infer<typeof productSchema>;

// ============================================
// Robust Schemas (Source of Truth)
// ============================================

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  description: z.string(),
  price: z.coerce.number().positive("Price must be positive"),
  costPrice: z.coerce.number().positive().optional(),
  discountPrice: z.coerce.number().positive().optional(),
  stockQuantity: z.coerce.number().int().min(0).optional(),
  lowStockThreshold: z.coerce.number().int().min(0).optional(),
  isUnlimitedStock: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
  thumbnail: z.string().url().optional(),
  categoryId: z
    .string()
    .min(1, "Category ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format"),
  tags: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]).optional(),
  isFeatured: z.boolean().optional(),
  expirationStart: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
  expirationEnd: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  sku: z.string().min(3).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  costPrice: z.coerce.number().positive().optional(),
  discountPrice: z.coerce.number().positive().optional(),
  stockQuantity: z.coerce.number().int().min(0).optional(),
  lowStockThreshold: z.coerce.number().int().min(0).optional(),
  isUnlimitedStock: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
  thumbnail: z.string().url().optional(),
  categoryId: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid Category ID format",
    }),
  tags: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]).optional(),
  isFeatured: z.boolean().optional(),
  expirationStart: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
  expirationEnd: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
});

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]).optional(),
  isFeatured: z.preprocess(
    (v) => v === "true" || v === true,
    z.boolean().optional()
  ),
  hasDiscount: z.preprocess(
    (v) => v === "true" || v === true,
    z.boolean().optional()
  ),
  stockStatus: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]).optional(),
  sortBy: z
    .enum(["createdAt", "price", "stockQuantity", "totalSales"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = GetProductsQuery;
