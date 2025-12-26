import { prisma } from "../lib/prisma.js";
import type { Prisma } from "@prisma/client";

export const reviewsRepository = {
  async create(data: Prisma.ReviewCreateInput) {
    return prisma.review.create({
      data,
    });
  },

  async updateProductRatings(productId: string, rating: number) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { averageRating: true, ratingCount: true },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      const newCount = product.ratingCount + 1;
      const newAverage =
        (product.averageRating * product.ratingCount + rating) / newCount;

      return tx.product.update({
        where: { id: productId },
        data: {
          averageRating: newAverage,
          ratingCount: newCount,
        },
      });
    });
  },

  async findByProductId(productId: string, skip: number, take: number) {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.review.count({ where: { productId } }),
    ]);

    return { reviews, total };
  },

  async findAll(skip: number, take: number) {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            select: {
              name: true,
              thumbnail: true,
            },
          },
          customer: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.review.count(),
    ]);

    return { reviews, total };
  },
};
