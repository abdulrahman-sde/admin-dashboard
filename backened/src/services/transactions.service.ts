import { transactionsRepository } from "../repositories/transactions.repository.js";
import {
  getSkipTake,
  getPaginationMeta,
  buildDateRangeFilter,
} from "../utils/query.utils.js";
import type { GetTransactionsQuery } from "../utils/validators/transaction.validator.js";
import type { Prisma, PaymentStatus } from "@prisma/client";

export const transactionsService = {
  async getTransactions(query: GetTransactionsQuery) {
    const {
      page,
      limit,
      search,
      paymentStatus,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    } = query;

    const where: Prisma.TransactionWhereInput = {};
    const and: Prisma.TransactionWhereInput[] = [];

    if (paymentStatus)
      and.push({ paymentStatus: paymentStatus as PaymentStatus });

    if (search) {
      const orConditions: Prisma.TransactionWhereInput[] = [
        { transactionNumber: { contains: search, mode: "insensitive" } },
        {
          order: {
            orderNumber: { contains: search, mode: "insensitive" },
          },
        },
        {
          customer: {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];

      // Add exact ID search if it matches MongoDB ObjectId format
      if (/^[0-9a-fA-F]{24}$/.test(search)) {
        orConditions.push({ id: search });
        orConditions.push({ customerId: search });
      }

      and.push({ OR: orConditions });
    }

    const dateFilter = buildDateRangeFilter(startDate, endDate);
    if (dateFilter) and.push({ createdAt: dateFilter as any });

    if (and.length) where.AND = and;

    const orderBy: Prisma.TransactionOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    } as any;

    const { skip, take } = getSkipTake({ page, limit });

    const { transactions, total } = await transactionsRepository.findAll({
      skip,
      take,
      where,
      orderBy,
    });

    return {
      data: transactions,
      pagination: getPaginationMeta(total, { page, limit }),
    };
  },

  async getTransactionById(id: string) {
    return transactionsRepository.findById(id);
  },
};
