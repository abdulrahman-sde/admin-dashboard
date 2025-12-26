import { prisma } from "../lib/prisma.js";
import type { User, Prisma } from "@prisma/client";

export const userRepository = {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  /**
   * Create new user
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },

  /**
   * Update user
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },

  /**
   * Delete user (soft delete)
   */
  async delete(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
