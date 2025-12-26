import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  listCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  createCustomer,
} from "../../controllers/admin/customers.controller.js";

const router = Router();

router.post("/", asyncHandler(createCustomer));
router.get("/", asyncHandler(listCustomers));
router.get("/:id", asyncHandler(getCustomer));
router.put("/:id", asyncHandler(updateCustomer));
router.delete("/:id", asyncHandler(deleteCustomer));

export default router;
