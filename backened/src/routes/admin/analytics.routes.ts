import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  getTwoWeekStats,
  getDetailedDailyMetrics,
} from "../../controllers/admin/analytics.controller.js";

import { getReportsData } from "../../controllers/admin/reports.controller.js";

const router = Router();

router.get("/two-week-stats", asyncHandler(getTwoWeekStats));
router.get("/detailed-daily-metrics", asyncHandler(getDetailedDailyMetrics));
router.get("/reports", asyncHandler(getReportsData));

export default router;
