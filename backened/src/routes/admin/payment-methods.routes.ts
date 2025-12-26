import { Router } from "express";
import { paymentMethodsController } from "../../controllers/admin/payment-methods.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(paymentMethodsController.createPaymentMethod));
router.get("/", asyncHandler(paymentMethodsController.getAllPaymentMethods));
router.get("/:id", asyncHandler(paymentMethodsController.getPaymentMethodById));
router.patch(
  "/:id",
  asyncHandler(paymentMethodsController.updatePaymentMethod)
);
router.delete(
  "/:id",
  asyncHandler(paymentMethodsController.deletePaymentMethod)
);

export default router;
