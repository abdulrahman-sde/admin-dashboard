import type { Prisma } from "@prisma/client";

import type { Session } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export const sessionRepository = {
  async create(data: Prisma.SessionCreateInput): Promise<Session> {
    return await prisma.session.create({ data });
  },

  async createEvent(data: Prisma.SessionEventUncheckedCreateInput) {
    return await prisma.sessionEvent.create({ data });
  },

  async findAll() {
    return await prisma.session.findMany();
  },
};
