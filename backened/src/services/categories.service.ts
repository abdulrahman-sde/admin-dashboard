import { categoryRepository } from "../repositories/categories.repository.js";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../utils/errors.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../utils/validators/category.validator.js";

export const categoriesService = {
  async getAllCategories() {
    const { categories } = await categoryRepository.findMany();

    return categories;
  },

  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  },

  async getCategoryBySlug(slug: string) {
    const category = await categoryRepository.findBySlug(slug);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  },

  async createCategory(input: CreateCategoryInput) {
    const nameExists = await categoryRepository.existsByName(input.name);
    if (nameExists) {
      throw new ConflictError("Category with this name already exists");
    }
    const slugExists = await categoryRepository.existsBySlug(input.slug);
    if (slugExists) {
      throw new ConflictError("Category with this slug already exists");
    }

    const category = await categoryRepository.create({
      name: input.name,
      slug: input.slug,
      description: input.description,
      image: input.image,
      visibility: input.visibility ?? true,
      sortOrder: input.sortOrder || 0,
    });

    return category;
  },

  async updateCategory(id: string, input: UpdateCategoryInput) {
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundError("Category not found");
    }

    const category = await categoryRepository.update(id, input);

    return category;
  },

  async deleteCategory(id: string) {
    // Check if category exists
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    // Check if category has products
    if ((category as any)._count && (category as any)._count.products > 0) {
      throw new BadRequestError(
        `Cannot delete category with ${
          (category as any)._count.products
        } products. Please reassign or delete the products first.`
      );
    }

    await categoryRepository.delete(id);

    return { message: "Category deleted successfully" };
  },
};
