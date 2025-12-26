import type { Request } from "express";

interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export const getPaginationParams = (
  req: Request,
  defaultLimit = 10,
  maxLimit = 100
): PaginationParams => {
  let page = Number(req.query.page);
  let limit = Number(req.query.limit);

  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }

  if (Number.isNaN(limit) || limit < 1) {
    limit = defaultLimit;
  }

  if (limit > maxLimit) {
    limit = maxLimit;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
