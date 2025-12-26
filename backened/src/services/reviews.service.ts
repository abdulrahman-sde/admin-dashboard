import { reviewsRepository } from "../repositories/reviews.repository.js";
import type { CreateReviewInput } from "../utils/validators/review.validator.js";

export const reviewsService = {
  async addReview(input: CreateReviewInput) {
    const { productId, customerId, rating, comment } = input;

    // 1. Create the review
    const review = await reviewsRepository.create({
      product: { connect: { id: productId } },
      ...(customerId && { customer: { connect: { id: customerId } } }),
      rating,
      comment,
    });

    // 2. Update denormalized product rating
    await reviewsRepository.updateProductRatings(productId, rating);

    return review;
  },

  async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;
    return reviewsRepository.findByProductId(productId, skip, limit);
  },

  async getAllReviews(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return reviewsRepository.findAll(skip, limit);
  },
};
