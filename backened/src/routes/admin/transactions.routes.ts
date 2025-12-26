import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  listTransactions,
  getTransaction,
} from "../../controllers/admin/transactions.controller.js";

const router = Router();

router.get("/", asyncHandler(listTransactions));
router.get("/:id", asyncHandler(getTransaction));

export default router;
