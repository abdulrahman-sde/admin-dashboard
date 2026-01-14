import type {
  CreateSessionInput,
  CreateSessionEventInput,
} from "../types/session.types.js";
import { sessionRepository } from "../repositories/session.repository.js";
import { setSession } from "../utils/redis.utils.js";
import type { Prisma } from "@prisma/client";

export const sessionService = {
  async createSession({ data }: { data: CreateSessionInput }) {
    const session = await sessionRepository.create({
      ...data,
      startedAt: new Date(),
      lastSeenAt: new Date(),
    });

    await setSession(
      session.sessionId,
      {
        sessionId: session.sessionId,
        visitorId: session.visitorId || "",
        type: session.type,
        customerId: session.customerId || undefined,
        device: session.device || undefined,
      },
      30 * 60
    );

    return session;
  },

  async trackEvent(data: CreateSessionEventInput) {
    return await sessionRepository.createEvent({
      eventType: data.eventType,
      page: data.page,
      productId: data.productId,
      metadata: (data.metadata || {}) as unknown as Prisma.InputJsonValue,
      sessionId: data.sessionId,
    });
  },

  async getAllSessions() {
    return sessionRepository.findAll();
  },
};
