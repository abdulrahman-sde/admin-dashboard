import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { reportsService } from "../../services/reports.service.js";

/**
 * Get reports data for a specific date range
 */
export const getReportsData = asyncHandler(
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query as {
      startDate?: string;
      endDate?: string;
    };

    const data = await reportsService.getReportsData(startDate, endDate);

    if (!data) {
      return res
        .status(400)
        .json(errorResponse("Start date and end date are required"));
    }

    res.json(successResponse(data, "Reports data fetched successfully"));
  }
);

/**
 * Get customer demographics (all-time)
 */
export const getCustomerDemographics = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportsService.getCustomerDemographics();
    res.json(
      successResponse(data, "Customer demographics fetched successfully")
    );
  }
);

/**
 * Get top customers by spending
 */
export const getTopCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const data = await reportsService.getTopCustomers(limit);
    res.json(successResponse(data, "Top customers fetched successfully"));
  }
);

/**
 * Get top products by sales
 */
export const getTopProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const data = await reportsService.getTopProducts(limit);
    res.json(successResponse(data, "Top products fetched successfully"));
  }
);

/**
 * Get active sessions from Redis
 */
export const getActiveSessions = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportsService.getActiveSessions();
    res.json(successResponse(data, "Active sessions fetched successfully"));
  }
);

/**
 * Get device analytics
 */
export const getDeviceAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query as {
      startDate?: string;
      endDate?: string;
    };

    const data = await reportsService.getDeviceAnalytics(startDate, endDate);
    res.json(successResponse(data, "Device analytics fetched successfully"));
  }
);
