import type { Category } from "@prisma/client";

// ============================================
// Category Types
// ============================================

/**
 * Safe Category type - excludes soft delete timestamp
 * Use this for API responses to avoid exposing internal deletion state
 */
export type SafeCategory = Omit<Category, "deletedAt">;

// Note: CreateCategoryInput and UpdateCategoryInput are now exported
// from validators/category.validator.ts as Zod-inferred types
