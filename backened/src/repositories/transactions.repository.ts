import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export const transactionsRepository = {
  async findAll(params: {
    skip: number;
    take: number;
    where: Prisma.TransactionWhereInput;
    orderBy: Prisma.TransactionOrderByWithRelationInput;
  }) {
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy,
        include: {
          customer: {
            select: { firstName: true, lastName: true, email: true },
          },
          order: { select: { orderNumber: true, totalAmount: true } },
          storePaymentMethod: true,
        },
      }),
      prisma.transaction.count({ where: params.where }),
    ]);

    return { transactions, total };
  },

  async findById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        customer: { select: { firstName: true, lastName: true, email: true } },
        order: { select: { orderNumber: true, totalAmount: true, id: true } },
        storePaymentMethod: true,
      },
    });
  },
};

export default transactionsRepository;
