import type { Request, Response } from "express";
import {
  getOrdersQuerySchema,
  parseCreateOrderInput,
} from "../../utils/validators/order.validator.js";
import { ordersService } from "../../services/orders.service.js";
import { successResponse } from "../../utils/response.js";
import { getNormalizedHeaders } from "../../utils/header.utils.js";

export const createOrder = async (req: Request, res: Response) => {
  const validated = parseCreateOrderInput(req.body);
  const sessionId = req.session?.sessionId;
  const visitorId = req.session?.visitorId;
  // Extract headers fresh from request (Hot state data in Redis doesn't store this anymore)
  const { userAgent, country, device, ip } = getNormalizedHeaders(req);

  const payload = {
    ...validated,
    sessionId: sessionId || undefined,
    visitorId: visitorId || undefined,
    ipAddress: ip,
    userAgent,
    device,
    country: country || undefined,
  };

  const result = await ordersService.createOrder(payload);

  return res
    .status(200)
    .json(successResponse(result, "Order created successfully"));
};

export const getOrders = async (req: Request, res: Response) => {
  // Validate Query Params
  const query = getOrdersQuerySchema.parse(req.query);

  // Fetch from Service
  const result = await ordersService.getOrders(query);

  return res
    .status(200)
    .json(successResponse(result, "Orders fetched successfully"));
};
