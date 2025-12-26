import { couponsRepository } from "../repositories/coupons.repository.js";
import type { Prisma, Coupon } from "@prisma/client";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../utils/errors.js";
import type {
  CreateCouponInput,
  UpdateCouponInput,
  GetCouponsQuery,
} from "../utils/validators/coupon.validator.js";

export interface CouponValidationResult {
  coupon: Coupon;
  discountAmount: number;
}

export const couponsService = {
  /**
   * Fetch Coupons with Filtering
   */
  async getCoupons(query: GetCouponsQuery) {
    const { page, limit, search, status, type, sortBy, sortOrder } = query;

    const where: Prisma.CouponWhereInput = {};
    const andConditions: Prisma.CouponWhereInput[] = [];

    // Search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filters
    if (status) andConditions.push({ status });
    if (type) andConditions.push({ type });

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const skip = (page - 1) * limit;

    const { coupons, total } = await couponsRepository.findAll({
      skip,
      take: limit,
      where,
      orderBy: { [sortBy]: sortOrder },
    });

    return {
      data: coupons,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  },

  async getCouponById(id: string) {
    const coupon = await couponsRepository.findById(id);
    if (!coupon) throw new NotFoundError("Coupon not found");
    return coupon;
  },

  async createCoupon(input: CreateCouponInput) {
    // Check Uniqueness
    const existing = await couponsRepository.findByCode(input.code);
    if (existing)
      throw new ConflictError(`Coupon code '${input.code}' already exists`);

    // Format Payload
    const data: Prisma.CouponCreateInput = {
      ...input,
      appliesTo: input.appliesTo ?? undefined, // Handle optional JSON
    };

    return await couponsRepository.create(data);
  },

  async updateCoupon(id: string, input: UpdateCouponInput) {
    const coupon = await couponsRepository.findById(id);
    if (!coupon) throw new NotFoundError("Coupon not found");

    // If code is changing, check uniqueness
    if (input.code && input.code !== coupon.code) {
      const existing = await couponsRepository.findByCode(input.code);
      if (existing)
        throw new ConflictError(`Coupon code '${input.code}' already exists`);
    }

    return await couponsRepository.update(id, input);
  },

  async deleteCoupon(id: string) {
    const coupon = await couponsRepository.findById(id);
    if (!coupon) throw new NotFoundError("Coupon not found");

    return await couponsRepository.delete(id);
  },

  async bulkDeleteCoupons(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new ValidationError("IDs are required for bulk delete");
    }

    const deletedCount = await couponsRepository.deleteMany(ids);
    return deletedCount;
  },

  /**
   * Validate and calculate discount from a coupon code
   */
  async validateAndApplyCoupon(
    couponCode: string,
    subtotal: number,
    shippingFee: number
  ): Promise<CouponValidationResult> {
    // 1. Find coupon by code
    const coupon = await couponsRepository.findByCode(couponCode);
    if (!coupon) {
      throw new ValidationError(`No coupon found with code: ${couponCode}`);
    }

    // 2. Check status
    if (coupon.status !== "ACTIVE") {
      throw new ValidationError(`Coupon '${couponCode}' is not active`);
    }

    // 3. Check date validity
    const now = new Date();
    if (coupon.startDate > now) {
      throw new ValidationError(
        `Coupon '${couponCode}' is not yet valid. Valid from ${coupon.startDate.toDateString()}`
      );
    }

    if (coupon.endDate && coupon.endDate < now) {
      throw new ValidationError(
        `Coupon '${couponCode}' has expired on ${coupon.endDate.toDateString()}`
      );
    }

    // 4. Check usage limit
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      throw new ValidationError(
        `Coupon '${couponCode}' has reached its usage limit`
      );
    }

    // 5. Calculate discount based on type
    let discountAmount = 0;

    switch (coupon.type) {
      case "FIXED":
      case "PRICE_DISCOUNT":
        // Fixed amount discount
        discountAmount = Math.min(coupon.value, subtotal);
        break;

      case "PERCENTAGE":
        // Percentage discount
        discountAmount = (subtotal * coupon.value) / 100;
        break;

      case "FREE_SHIPPING":
        // Free shipping discount
        discountAmount = shippingFee;
        break;

      default:
        throw new ValidationError(`Unsupported coupon type: ${coupon.type}`);
    }

    // Ensure discount is never negative
    discountAmount = Math.max(0, discountAmount);

    return {
      coupon,
      discountAmount,
    };
  },
};
