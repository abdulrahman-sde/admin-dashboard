import type { Request, Response } from "express";
import { categoriesService } from "../../services/categories.service.js";
import { successResponse, paginatedResponse } from "../../utils/response.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../../utils/validators/category.validator.js";
import { ValidationError } from "../../utils/errors.js";

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await categoriesService.getAllCategories();
  res.json(successResponse(result, "Categories retrieved successfully"));
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  if (!id) throw new ValidationError("ID is required");

  const category = await categoriesService.getCategoryById(id);

  res.json(successResponse(category, "Category retrieved successfully"));
};

export const getCategoryBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { slug } = req.params;
  if (!slug) throw new ValidationError("Slug is required");

  const category = await categoriesService.getCategoryBySlug(slug);

  res.json(successResponse(category, "Category retrieved successfully"));
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validatedData = createCategorySchema.parse(req.body);

  const category = await categoriesService.createCategory({
    name: validatedData.name,
    slug: validatedData.slug,
    description: validatedData.description,
    image: validatedData.image,
    sortOrder: validatedData.sortOrder,
    visibility: validatedData.visibility,
  });

  res
    .status(201)
    .json(successResponse(category, "Category created successfully"));
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  if (!id) throw new Error("ID is required");

  const validatedData = updateCategorySchema.parse(req.body);

  const category = await categoriesService.updateCategory(id, validatedData);

  res.json(successResponse(category, "Category updated successfully"));
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  if (!id) throw new ValidationError("ID is required");

  const result = await categoriesService.deleteCategory(id);

  res.json(successResponse(result, result.message));
};
