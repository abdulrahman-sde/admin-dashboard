import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { successResponse } from "../../utils/response.js";

/**
 * Global Search Controller (Admin)
 */
export const search = async (req: Request, res: Response) => {
  const query = (req.query.q as string) || "";

  if (!query) {
    return res.json(
      successResponse(
        { products: [], categories: [], customers: [] },
        "Empty query"
      )
    );
  }

  // Run search queries in parallel
  const [products, categories, customers] = await Promise.all([
    // 1. Search Products (Name, Slug, SKU)
    prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        images: true,
        status: true,
      },
    }),

    // 2. Search Categories (Name, Slug)
    prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),

    // 3. Search Customers (Name, Email, Phone)
    prisma.customer.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
      },
    }),
  ]);

  res.status(200).json(
    successResponse(
      {
        products,
        categories,
        customers,
      },
      "Search results"
    )
  );
};
