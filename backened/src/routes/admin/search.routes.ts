import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as searchController from "../../controllers/admin/search.controller.js";

const router = Router();

// GET /api/admin/search?q=query
router.get("/", asyncHandler(searchController.search));

export default router;
