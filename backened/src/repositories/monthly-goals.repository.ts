import { prisma } from "../lib/prisma.js";
import type { Prisma } from "@prisma/client";

export const monthlyGoalsRepository = {
  async create(data: {
    month: string;
    goalAmount: number;
    createdBy?: string;
  }) {
    return prisma.monthlyGoal.create({ data });
  },

  async findAll(params: {
    skip: number;
    take: number;
    where?: Prisma.MonthlyGoalWhereInput;
  }) {
    const [items, total] = await Promise.all([
      prisma.monthlyGoal.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: { month: "desc" },
      }),
      prisma.monthlyGoal.count({ where: params.where }),
    ]);

    return { items, total };
  },

  async findById(id: string) {
    return prisma.monthlyGoal.findUnique({ where: { id } });
  },

  async findByMonth(month: string) {
    return prisma.monthlyGoal.findUnique({ where: { month } });
  },
};

export default monthlyGoalsRepository;
