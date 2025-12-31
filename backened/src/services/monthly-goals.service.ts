import { monthlyGoalsRepository } from "../repositories/monthly-goals.repository.js";

export const monthlyGoalsService = {
  async createMonthlyGoal(data: {
    month: string;
    goalAmount: number;
    createdBy?: string;
  }) {
    // prevent duplicate month entries
    const existing = await monthlyGoalsRepository.findByMonth(data.month);
    if (existing) throw new Error("Monthly goal for this month already exists");

    return monthlyGoalsRepository.create(data);
  },

  async getMonthlyGoals(params: { skip: number; take: number; where?: any }) {
    return monthlyGoalsRepository.findAll(params);
  },

  async getMonthlyGoalById(id: string) {
    const item = await monthlyGoalsRepository.findById(id);
    if (!item) throw new Error("Monthly goal not found");
    return item;
  },
};

export default monthlyGoalsService;
