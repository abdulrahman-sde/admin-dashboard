import type { Prisma, Product, ProductStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../utils/validators/product.validator.js";
import type {
  ProductStatsFacetResult,
  ProductStatsResult,
} from "../types/products.types.js";

export const productRepository = {
  getAll: async ({
    skip,
    take,
    where,
    orderBy,
  }: {
    skip: number;
    take: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<{ products: Product[]; total: number }> => {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        orderBy,
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
        where,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  },

  findById: async (id: string): Promise<Product | null> => {
    return await prisma.product.findUnique({
      where: {
        id,
      },
    });
  },

  create: async (data: CreateProductInput): Promise<Product> => {
    return await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        description: data.description,
        price: data.price,
        costPrice: data.costPrice ?? null,
        discountPrice: data.discountPrice ?? null,
        stockQuantity: data.stockQuantity ?? 0,
        lowStockThreshold: data.lowStockThreshold ?? 10,
        isUnlimitedStock: data.isUnlimitedStock ?? false,
        images: data.images ?? [],
        thumbnail: data.thumbnail ?? null,
        categoryId: data.categoryId,
        tags: data.tags ?? [],
        colors: data.colors ?? [],
        status: (data.status as ProductStatus) ?? "DRAFT", // Handle default & cast
        isFeatured: data.isFeatured ?? false, // Handle default
        expirationStart: data.expirationStart ?? null,
        expirationEnd: data.expirationEnd ?? null,
        deletedAt: null,
      },
    });
  },

  update: async (id: string, data: UpdateProductInput): Promise<Product> => {
    return await prisma.product.update({
      where: { id },
      data: {
        ...data,
        status: data.status as ProductStatus | undefined,
      },
    });
  },

  delete: async (id: string): Promise<Product> => {
    return await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  incrementSales: async (id: string, quantity: number) => {
    return prisma.product.update({
      where: { id },
      data: {
        totalSales: { increment: quantity },
      },
      select: { id: true },
    });
  },

  deleteMany: async (ids: string[]): Promise<number> => {
    const result = await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
    return result.count;
  },

  getFilterCounts: async (): Promise<ProductStatsResult> => {
    const result = await prisma.product.aggregateRaw({
      pipeline: [
        {
          $match: {
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          },
        },
        {
          $facet: {
            total: [{ $count: "count" }],
            featured: [{ $match: { isFeatured: true } }, { $count: "count" }],
            onSale: [
              { $match: { discountPrice: { $gt: 0 } } },
              { $count: "count" },
            ],
            outOfStock: [
              { $match: { stockQuantity: { $lte: 0 } } },
              { $count: "count" },
            ],
          },
        },
      ],
    });

    // Type the raw facet result
    const facetResult = (result as any)[0];

    return {
      all: facetResult?.total[0]?.count ?? 0,
      featured: facetResult?.featured[0]?.count ?? 0,
      onSale: facetResult?.onSale[0]?.count ?? 0,
      outOfStock: facetResult?.outOfStock[0]?.count ?? 0,
    };
  },
};
