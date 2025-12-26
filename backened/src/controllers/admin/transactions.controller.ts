import type { Request, Response } from "express";
import { successResponse, paginatedResponse } from "../../utils/response.js";
import { transactionsService } from "../../services/transactions.service.js";
import { getTransactionsQuerySchema } from "../../utils/validators/transaction.validator.js";

export const listTransactions = async (req: Request, res: Response) => {
  const query = getTransactionsQuerySchema.parse(req.query);

  const { data, pagination } = await transactionsService.getTransactions(query);

  return res.json({ ...paginatedResponse(data, pagination) });
};

export const getTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(400)
      .json(successResponse(null, "Transaction id required"));

  const txn = await transactionsService.getTransactionById(id);
  if (!txn)
    return res.status(404).json(successResponse(null, "Transaction not found"));

  return res.json(successResponse(txn, "Transaction retrieved"));
};
