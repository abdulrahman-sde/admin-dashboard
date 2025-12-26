import type { Request, Response } from "express";
import { reviewsService } from "../../services/reviews.service.js";
import { createReviewSchema } from "../../utils/validators/review.validator.js";
import type { CreateReviewInput } from "../../utils/validators/review.validator.js";

export const reviewsController = {
  async addReview(req: Request, res: Response) {
    const validatedData: CreateReviewInput = createReviewSchema.parse(req.body);
    const review = await reviewsService.addReview(validatedData);

    res.status(201).json({
      status: "success",
      data: review,
    });
  },

  async getProductReviews(req: Request, res: Response) {
    const { productId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!productId) {
      res
        .status(400)
        .json({ status: "error", message: "Product ID is required" });
      return;
    }

    const { reviews, total } = await reviewsService.getProductReviews(
      productId,
      page,
      limit
    );

    res.json({
      status: "success",
      data: reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  },

  async getAllReviews(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { reviews, total } = await reviewsService.getAllReviews(page, limit);

    res.json({
      status: "success",
      data: reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  },
};
