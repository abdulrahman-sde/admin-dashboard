import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  listCoupons,
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  bulkDeleteCoupons,
} from "../../controllers/admin/coupons.controller.js";

const router = Router();

// /api/admin/coupons

router.get("/", asyncHandler(listCoupons));
router.post("/", asyncHandler(createCoupon));
router.post("/bulk-delete", asyncHandler(bulkDeleteCoupons));

router.get("/:id", asyncHandler(getCoupon));
router.put("/:id", asyncHandler(updateCoupon));
router.delete("/:id", asyncHandler(deleteCoupon));

export default router;
