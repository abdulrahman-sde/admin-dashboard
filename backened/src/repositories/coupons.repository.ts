import { prisma } from "../lib/prisma.js";
import type { Prisma, Coupon } from "@prisma/client";

export const couponsRepository = {
  async findById(id: string): Promise<Coupon | null> {
    return prisma.coupon.findUnique({ where: { id } });
  },

  async findByCode(code: string): Promise<Coupon | null> {
    return prisma.coupon.findUnique({ where: { code } });
  },

  async create(data: Prisma.CouponCreateInput): Promise<Coupon> {
    return prisma.coupon.create({ data });
  },

  async update(id: string, data: Prisma.CouponUpdateInput): Promise<Coupon> {
    return prisma.coupon.update({ where: { id }, data });
  },

  async delete(id: string): Promise<Coupon> {
    return prisma.coupon.delete({ where: { id } });
  },

  async findAll(params: {
    skip: number;
    take: number;
    where: Prisma.CouponWhereInput;
    orderBy: Prisma.CouponOrderByWithRelationInput;
  }) {
    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy,
      }),
      prisma.coupon.count({ where: params.where }),
    ]);

    return { coupons, total };
  },

  async incrementUsage(id: string) {
    return prisma.coupon.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
      select: { id: true, usageCount: true },
    });
  },
  async deleteMany(ids: string[]) {
    const result = await prisma.coupon.deleteMany({
      where: { id: { in: ids } },
    });
    return result.count;
  },
};
