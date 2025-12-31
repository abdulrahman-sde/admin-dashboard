import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { reportsService } from "../../services/reports.service.js";

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
