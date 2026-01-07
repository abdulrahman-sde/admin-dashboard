import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { successResponse } from "../../utils/response.js";

export const search = async (req: Request, res: Response) => {
  const query = (req.query.q as string) || "";

  if (!query) {
    return res.json(successResponse([], "Empty query"));
  }

  const [products, categories, customers] = await Promise.all([
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
        images: true,
      },
    }),

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
      },
    }),

    prisma.customer.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
        ],
        deletedAt: null,
      },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    }),
  ]);

  const formattedResults = [
    ...products.map((p) => ({
      id: p.id,
      type: "product",
      name: p.name,
      pic: p.images && p.images.length > 0 ? p.images[0] : null,
    })),
    ...categories.map((c) => ({
      id: c.id,
      type: "category",
      name: c.name,
      pic: null,
    })),
    ...customers.map((c) => ({
      id: c.id,
      type: "customer",
      name: `${c.firstName} ${c.lastName}`,
      pic: c.avatar,
    })),
  ];

  res.status(200).json(successResponse(formattedResults, "Search results"));
};
