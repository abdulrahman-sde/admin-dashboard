import type { Request, Response } from "express";
import { customersService } from "../../services/customers.service.js";
import { successResponse, paginatedResponse } from "../../utils/response.js";
import {
  getCustomersQuerySchema,
  updateCustomerSchema,
  createCustomerSchema,
  customerParamsSchema,
} from "../../utils/validators/customer.validator.js";

import { ValidationError } from "../../utils/errors.js";

export const listCustomers = async (req: Request, res: Response) => {
  const query = getCustomersQuerySchema.parse(req.query);
  const { data, pagination } = await customersService.getCustomers(query);

  res.json({
    ...paginatedResponse(data, pagination),
  });
};

export const createCustomer = async (req: Request, res: Response) => {
  const body = createCustomerSchema.parse(req.body);
  const customer = await customersService.createCustomer(body);
  res
    .status(201)
    .json(successResponse(customer, "Customer created successfully"));
};

/**
 * Get Single Customer
 */
export const getCustomer = async (req: Request, res: Response) => {
  const { id } = customerParamsSchema.parse(req.params);
  const customer = await customersService.getCustomerById(id);
  res.json(successResponse(customer));
};

/**
 * Update Customer
 */
export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = customerParamsSchema.parse(req.params);
  const body = updateCustomerSchema.parse(req.body);

  const updated = await customersService.updateCustomer(id, body);
  res.json(successResponse(updated, "Customer updated successfully"));
};

/**
 * Delete Customer
 */
export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = customerParamsSchema.parse(req.params);
  await customersService.deleteCustomer(id);
  res.json(successResponse(null, "Customer deleted"));
};
