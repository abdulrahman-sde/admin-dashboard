import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  listMonthlyGoals,
  createMonthlyGoal,
  getMonthlyGoal,
} from "../../controllers/admin/monthly-goals.controller.js";

const router = Router();

// /api/admin/monthly-goals
router.get("/", asyncHandler(listMonthlyGoals));
router.post("/", asyncHandler(createMonthlyGoal));
router.get("/:id", asyncHandler(getMonthlyGoal));

export default router;
