import type { Request, Response } from "express";
import { couponsService } from "../../services/coupons.service.js";
import { successResponse, paginatedResponse } from "../../utils/response.js";
import {
  getCouponsQuerySchema,
  createCouponSchema,
  updateCouponSchema,
} from "../../utils/validators/coupon.validator.js";
import { bulkDeleteCouponsSchema } from "../../utils/validators/coupon.validator.js";
import { ValidationError } from "../../utils/errors.js";

export const listCoupons = async (req: Request, res: Response) => {
  const query = getCouponsQuerySchema.parse(req.query);
  const { data, pagination } = await couponsService.getCoupons(query);

  res.json({
    ...paginatedResponse(data, pagination),
  });
};

export const getCoupon = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ValidationError("ID Required");

  const coupon = await couponsService.getCouponById(id);
  res.json(successResponse(coupon));
};

export const createCoupon = async (req: Request, res: Response) => {
  const body = createCouponSchema.parse(req.body);
  const coupon = await couponsService.createCoupon(body);
  res.status(201).json(successResponse(coupon, "Coupon created successfully"));
};

export const updateCoupon = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ValidationError("ID Required");

  const body = updateCouponSchema.parse(req.body);
  const updated = await couponsService.updateCoupon(id, body);
  res.json(successResponse(updated, "Coupon updated successfully"));
};

export const deleteCoupon = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ValidationError("ID Required");

  await couponsService.deleteCoupon(id);
  res.json(successResponse(null, "Coupon deleted"));
};

export const bulkDeleteCoupons = async (req: Request, res: Response) => {
  const { ids } = bulkDeleteCouponsSchema.parse(req.body);
  const deletedCount = await couponsService.bulkDeleteCoupons(ids);
  res.json(
    successResponse(
      { deleted: deletedCount },
      `${deletedCount} coupons deleted`
    )
  );
};
