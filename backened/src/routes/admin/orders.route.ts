import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  listOrders,
  updateOrder,
} from "../../controllers/admin/orders.controller.js";

const router = Router();

router.get("/", asyncHandler(listOrders));
router.patch("/:id", asyncHandler(updateOrder));

export default router;
