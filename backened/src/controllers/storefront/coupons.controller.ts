import type { Request, Response } from "express";
import { successResponse } from "../../utils/response.js";
import { z } from "zod";
import { couponsService } from "../../services/coupons.service.js";

export const validateCoupon = async (req: Request, res: Response) => {
  const schema = z.object({
    couponCode: z.string().min(1, "Coupon code is required"),
    subtotal: z.number().positive("Subtotal must be positive"),
    shippingFee: z
      .number()
      .nonnegative("Shipping fee must be non-negative")
      .default(0),
  });

  const { couponCode, subtotal, shippingFee } = schema.parse(req.body);

  const result = await couponsService.validateAndApplyCoupon(
    couponCode,
    subtotal,
    shippingFee
  );

  return res.json(
    successResponse(
      {
        valid: true,
        couponCode: result.coupon.code,
        couponName: result.coupon.name,
        couponType: result.coupon.type,
        discountAmount: result.discountAmount,
        finalTotal: subtotal + shippingFee - result.discountAmount,
      },
      "Coupon is valid"
    )
  );
};

export default { validateCoupon };
