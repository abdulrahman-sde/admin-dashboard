import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import couponsController from "../../controllers/storefront/coupons.controller.js";

const router = Router();

router.post("/validate", asyncHandler(couponsController.validateCoupon));

export default router;
