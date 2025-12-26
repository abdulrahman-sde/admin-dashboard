import { Router } from "express";
import { reviewsController } from "../../controllers/storefront/reviews.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(reviewsController.addReview));
router.get("/", asyncHandler(reviewsController.getAllReviews));
router.get(
  "/product/:productId",
  asyncHandler(reviewsController.getProductReviews)
);

export default router;
