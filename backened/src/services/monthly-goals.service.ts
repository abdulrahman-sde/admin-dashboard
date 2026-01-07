import type { Prisma } from "@prisma/client";
import { monthlyGoalsRepository } from "../repositories/monthly-goals.repository.js";

export const monthlyGoalsService = {
  async createMonthlyGoal(data: {
    month: string;
    goalAmount: number;
    createdBy?: string;
  }) {
    const existing = await monthlyGoalsRepository.findByMonth(data.month);
    if (existing) throw new Error("Monthly goal for this month already exists");

    return monthlyGoalsRepository.create(data);
  },

  async getMonthlyGoals(params: {
    skip: number;
    take: number;
    where?: Prisma.MonthlyGoalWhereInput;
  }) {
    return monthlyGoalsRepository.findAll(params);
  },

  async getMonthlyGoalById(id: string) {
    const item = await monthlyGoalsRepository.findById(id);
    if (!item) throw new Error("Monthly goal not found");
    return item;
  },
};

export default monthlyGoalsService;
