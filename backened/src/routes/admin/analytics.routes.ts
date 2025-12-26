import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getTwoWeekStats } from "../../controllers/admin/analytics.controller.js";

const router = Router();

router.get("/two-week-stats", asyncHandler(getTwoWeekStats));

export default router;
