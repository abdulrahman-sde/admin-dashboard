import { productRepository } from "../repositories/products.repository.js";
import { categoryRepository } from "../repositories/categories.repository.js";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../utils/validators/product.validator.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";
import { getSkipTake, getPaginationMeta } from "../utils/query.utils.js";

import type { Prisma } from "@prisma/client";

import type { GetProductsQuery } from "../utils/validators/product.validator.js";

export const productsService = {
  async getProducts(query: GetProductsQuery) {
    const {
      page,
      limit,
      search,
      categoryId,
      status,
      isFeatured,
      hasDiscount,
      stockStatus,
      sortBy,
      sortOrder,
    } = query;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };
    const andConditions: Prisma.ProductWhereInput[] = [];

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    // 2. Filters
    if (categoryId) andConditions.push({ categoryId });
    if (status) andConditions.push({ status });

    if (isFeatured) andConditions.push({ isFeatured: true });
    if (hasDiscount) andConditions.push({ discountPrice: { gt: 0 } });

    // 3. Stock Status Logic
    if (stockStatus) {
      if (stockStatus === "OUT_OF_STOCK") {
        andConditions.push({ stockQuantity: { lte: 0 } });
      } else if (stockStatus === "LOW_STOCK") {
        andConditions.push({ stockQuantity: { gt: 0, lte: 10 } });
      } else if (stockStatus === "IN_STOCK") {
        andConditions.push({ stockQuantity: { gt: 0 } });
      }
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const { skip, take } = getSkipTake({ page, limit });

    // Execute queries in parallel
    const [productsResult, stats] = await Promise.all([
      productRepository.getAll({
        skip,
        take,
        where,
        orderBy: { [sortBy]: sortOrder },
      }),
      productRepository.getFilterCounts(),
    ]);

    const { products, total } = productsResult;

    return {
      data: products,
      pagination: getPaginationMeta(total, { page, limit }),
      meta: {
        all: stats.all,
        featured: stats.featured,
        onSale: stats.onSale,
        outOfStock: stats.outOfStock,
      },
    };
  },

  async getProductById(id: string) {
    return await productRepository.findById(id);
  },

  async createProduct(data: CreateProductInput) {
    const categoryExists = await categoryRepository.existsById(data.categoryId);

    if (!categoryExists) {
      throw new ValidationError("Invalid category id");
    }
    return await productRepository.create(data);
  },

  async updateProduct(id: string, data: UpdateProductInput) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (data.categoryId) {
      const categoryExists = await categoryRepository.existsById(
        data.categoryId
      );
      if (!categoryExists) {
        throw new ValidationError("Invalid category id");
      }
    }

    return await productRepository.update(id, data);
  },

  async deleteProduct(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return await productRepository.delete(id);
  },

  async bulkDeleteProducts(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new ValidationError("IDs are required for bulk delete");
    }

    const deletedCount = await productRepository.deleteMany(ids);
    return deletedCount;
  },
};
