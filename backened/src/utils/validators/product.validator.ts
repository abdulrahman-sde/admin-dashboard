import { z } from "zod";
import { paginationSchema, enumField, safeNumber } from "./helpers.js";

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  description: z.string(),
  price: safeNumber("Price").pipe(
    z.number().positive("Price must be positive")
  ),
  costPrice: safeNumber("Cost Price")
    .pipe(z.number().positive("Cost price must be positive"))
    .optional(),
  discountPrice: safeNumber("Discount Price")
    .pipe(z.number().positive("Discount price must be positive"))
    .optional(),
  stockQuantity: safeNumber("Stock Quantity")
    .pipe(z.number().int().min(0, "Stock quantity cannot be negative"))
    .optional(),
  lowStockThreshold: safeNumber("Low Stock Threshold")
    .pipe(z.number().int().min(0, "Threshold cannot be negative"))
    .optional(),
  isUnlimitedStock: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
  thumbnail: z.string().url().optional(),
  categoryId: z
    .string()
    .min(1, "Category ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format"),
  tags: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(), // Simple colors
  status: enumField(["ACTIVE", "INACTIVE", "DRAFT"], "Status").optional(),
  isFeatured: z.boolean().optional(),
  // Availability window
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
  price: safeNumber("Price")
    .pipe(z.number().positive("Price must be positive"))
    .optional(),
  costPrice: safeNumber("Cost Price")
    .pipe(z.number().positive("Cost price must be positive"))
    .optional(),
  discountPrice: safeNumber("Discount Price")
    .pipe(z.number().positive("Discount price must be positive"))
    .optional(),
  stockQuantity: safeNumber("Stock Quantity")
    .pipe(z.number().int().min(0, "Stock quantity cannot be negative"))
    .optional(),
  lowStockThreshold: safeNumber("Low Stock Threshold")
    .pipe(z.number().int().min(0, "Threshold cannot be negative"))
    .optional(),
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
  colors: z.array(z.string()).optional(), // Simple colors
  status: enumField(["ACTIVE", "INACTIVE", "DRAFT"], "Status").optional(),
  isFeatured: z.boolean().optional(),
  // Availability window
  expirationStart: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
  expirationEnd: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
});

// New Robust Query Schema
export const getProductsQuerySchema = paginationSchema.extend({
  search: z.string().optional(),

  // Filters
  categoryId: z.string().optional(),
  status: enumField(["ACTIVE", "INACTIVE", "DRAFT"], "Status").optional(),

  // Specific Filters
  isFeatured: z.preprocess(
    (v) => v === "true" || v === true,
    z.boolean().optional()
  ),
  hasDiscount: z.preprocess(
    (v) => v === "true" || v === true,
    z.boolean().optional()
  ),
  stockStatus: enumField(
    ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"],
    "Stock Status"
  ).optional(),

  // Sorting
  sortBy: enumField(
    ["createdAt", "price", "stockQuantity", "totalSales", "salesAndRevenue"],
    "Sort By"
  ).default("createdAt"),
  sortOrder: enumField(["asc", "desc"], "Sort Order").default("desc"),
});

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;

// ============================================
// Zod-Inferred Types (Single Source of Truth)
// ============================================

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = GetProductsQuery;
// Bulk delete validator
export const bulkDeleteProductsSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export type BulkDeleteInput = z.infer<typeof bulkDeleteProductsSchema>;
