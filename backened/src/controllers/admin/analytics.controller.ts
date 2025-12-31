import type { Request, Response } from "express";
import { analyticsService } from "../../services/analytics.service.js";
import { successResponse } from "../../utils/response.js";

export const getTwoWeekStats = async (_req: Request, res: Response) => {
  const stats = await analyticsService.getTwoWeekStats();
  res.json(successResponse(stats, "Two week stats fetched successfully"));
};

export const getDetailedDailyMetrics = async (_req: Request, res: Response) => {
  const metrics = await analyticsService.getDetailedDailyMetrics();
  res.json(
    successResponse(metrics, "Detailed daily metrics fetched successfully")
  );
};
export const getTopProducts = async (_req: Request, res: Response) => {
  // const products = await analyticsService.getTopProducts();
  // res.json(successResponse(products, "Top products fetched successfully"));
};

export const getRealTimeStats = async (_req: Request, res: Response) => {
  // const metrics = await analyticsService.getLiveMetrics();
  // res.json(successResponse(metrics, "Live metrics fetched successfully"));
};
