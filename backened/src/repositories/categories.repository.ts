import { prisma } from "../lib/prisma.js";
import type { Category } from "@prisma/client";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../utils/validators/category.validator.js";

export const categoryRepository = {
  async existsById(id: string): Promise<boolean> {
    const count = await prisma.category.count({ where: { id } });
    return count > 0;
  },

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  },

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { slug },
    });
  },

  async findMany(): Promise<{ categories: Category[] }> {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return { categories };
  },

  async create(data: CreateCategoryInput): Promise<Category> {
    return prisma.category.create({
      data: { ...data, deletedAt: null },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  },

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  },

  async delete(id: string): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async existsByName(name: string): Promise<boolean> {
    const count = await prisma.category.count({
      where: {
        name,
      },
    });
    return count > 0;
  },

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await prisma.category.count({
      where: {
        slug,
      },
    });
    return count > 0;
  },
};
