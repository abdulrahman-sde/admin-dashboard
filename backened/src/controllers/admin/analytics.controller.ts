import type { Request, Response } from "express";
import { analyticsService } from "../../services/analytics.service.js";
import { successResponse } from "../../utils/response.js";

export const getTwoWeekStats = async (_req: Request, res: Response) => {
  const stats = await analyticsService.getTwoWeekStats();
  res.json(successResponse(stats, "Two week stats fetched successfully"));
};
