import { prisma } from "../lib/prisma.js";
import type { Customer, Prisma } from "@prisma/client";
import type { SafeCustomer } from "../types/auth.types.js";

export const customerRepository = {
  async findById(id: string): Promise<SafeCustomer | null> {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            fulfillmentStatus: true,
            createdAt: true,
          },
        },
      },
      omit: { password: true },
    });
  },

  async findByEmail(email: string): Promise<Customer | null> {
    return prisma.customer.findUnique({ where: { email } });
  },

  async create(data: Prisma.CustomerCreateInput): Promise<SafeCustomer> {
    return prisma.customer.create({
      data: { ...data, deletedAt: null },
      omit: { password: true },
    });
  },

  async update(
    id: string,
    data: Prisma.CustomerUpdateInput
  ): Promise<SafeCustomer> {
    return prisma.customer.update({
      where: { id },
      data,
      omit: { password: true },
    });
  },

  async updateStats(id: string, amount: number) {
    return prisma.customer.update({
      where: { id },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: amount },
        lastOrderDate: new Date(),
      },
      select: { id: true }, // Minimal return
    });
  },

  async delete(id: string): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async findAll(params: {
    skip: number;
    take: number;
    where: Prisma.CustomerWhereInput;
    orderBy: Prisma.CustomerOrderByWithRelationInput;
  }) {
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          status: true,
          totalOrders: true,
          totalSpent: true,
          createdAt: true,
          isGuest: true,
          role: true,
        },
      }),
      prisma.customer.count({ where: params.where }),
    ]);

    return { customers, total };
  },

  async convertGuestToRegistered(
    email: string,
    password: string
  ): Promise<SafeCustomer> {
    return prisma.customer.update({
      where: { email },
      data: {
        password,
        isGuest: false,
      },
      omit: {
        password: true,
      },
    });
  },
};
