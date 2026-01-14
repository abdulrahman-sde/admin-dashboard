import type { Request, Response } from "express";
import { paymentMethodsService } from "../../services/payment-methods.service.js";
import { successResponse } from "../../utils/response.js";
import { ValidationError } from "../../utils/errors.js";
import {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
} from "../../utils/validators/payment-method.validator.js";

export const paymentMethodsController = {
  async createPaymentMethod(req: Request, res: Response) {
    const validatedData = createPaymentMethodSchema.parse(req.body);
    const method = await paymentMethodsService.createPaymentMethod(
      validatedData
    );

    res
      .status(201)
      .json(successResponse(method, "Payment method created successfully"));
  },

  async getAllPaymentMethods(_req: Request, res: Response) {
    const methods = await paymentMethodsService.getAllPaymentMethods();

    res.json(
      successResponse(methods, "Payment methods retrieved successfully")
    );
  },

  async getPaymentMethodById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) throw new ValidationError("ID is required");

    const method = await paymentMethodsService.getPaymentMethodById(id);

    res.json(successResponse(method, "Payment method retrieved successfully"));
  },

  async updatePaymentMethod(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) throw new ValidationError("ID is required");

    const validatedData = updatePaymentMethodSchema.parse(req.body);
    const method = await paymentMethodsService.updatePaymentMethod(
      id,
      validatedData
    );

    res.json(successResponse(method, "Payment method updated successfully"));
  },

  async deletePaymentMethod(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) throw new ValidationError("ID is required");

    await paymentMethodsService.deletePaymentMethod(id);

    res.json(successResponse(null, "Payment method deleted successfully"));
  },
};
