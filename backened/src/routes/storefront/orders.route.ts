import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createOrder } from "../../controllers/storefront/orders.controller.js";
const router = Router();

router.post("/create", asyncHandler(createOrder));

export default router;
