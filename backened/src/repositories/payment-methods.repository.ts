import { prisma } from "../lib/prisma.js";
import type { Prisma } from "@prisma/client";

export const paymentMethodsRepository = {
  async create(data: Prisma.StorePaymentMethodCreateInput) {
    // If setting as default, unset others first
    if (data.isDefault) {
      await prisma.storePaymentMethod.updateMany({
        where: {},
        data: { isDefault: false, status: "INACTIVE" },
      });
    }

    return prisma.storePaymentMethod.create({
      data,
    });
  },

  async findAll() {
    return prisma.storePaymentMethod.findMany({
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  },

  async findById(id: string) {
    return prisma.storePaymentMethod.findUnique({
      where: { id },
    });
  },

  async update(id: string, data: Prisma.StorePaymentMethodUpdateInput) {
    if (data.isDefault) {
      await prisma.storePaymentMethod.updateMany({
        where: { id: { not: id } },
        data: { isDefault: false, status: "INACTIVE" },
      });
    }

    return prisma.storePaymentMethod.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.storePaymentMethod.delete({
      where: { id },
    });
  },
};
