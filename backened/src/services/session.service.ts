import type {
  CreateSessionInput,
  CreateSessionEventInput,
} from "../types/session.types.js";
import { sessionRepository } from "../repositories/session.repository.js";
import { setSession } from "../utils/redis.utils.js";

export const sessionService = {
  async createSession({ data }: { data: CreateSessionInput }) {
    const session = await sessionRepository.create({
      ...data,
      startedAt: new Date(),
      lastSeenAt: new Date(),
    });

    // redis session storing
    await setSession(
      session.sessionId,
      {
        sessionId: session.sessionId,
        visitorId: session.visitorId || "",
        type: session.type,
        customerId: session.customerId || undefined,
      },
      30 * 60
    );

    return session;
  },

  async trackEvent(data: CreateSessionEventInput) {
    console.log(
      "🔍 [trackEvent] Tracking event for sessionId (UUID):",
      data.sessionId
    );

    // Optimized: Directly create the event using the public UUID (sessionId).
    // The Prisma schema now relates SessionEvent.sessionId to Session.sessionId (UUID).
    return await sessionRepository.createEvent({
      eventType: data.eventType,
      page: data.page,
      productId: data.productId,
      metadata: data.metadata || {},
      sessionId: data.sessionId,
    });
  },

  async getAllSessions() {
    return sessionRepository.findAll();
  },
};
