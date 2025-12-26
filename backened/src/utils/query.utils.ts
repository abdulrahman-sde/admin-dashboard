import type { PaginationOptions } from "../types/common.types.js";

export const getSkipTake = ({ page, limit }: PaginationOptions) => {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
};

export const getPaginationMeta = (
  total: number,
  { page, limit }: PaginationOptions
) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
};

export const buildDateRangeFilter = (
  startDate?: Date | string | null,
  endDate?: Date | string | null
) => {
  if (!startDate && !endDate) return undefined;

  const filter: { gte?: Date; lte?: Date } = {};
  if (startDate) filter.gte = new Date(startDate);
  if (endDate) filter.lte = new Date(endDate);
  return filter;
};
