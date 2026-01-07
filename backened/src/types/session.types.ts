export type SessionType = "ANONYMOUS" | "CUSTOMER";

export interface RedisSessionData {
  sessionId: string;
  visitorId: string;
  type: SessionType;
  customerId?: string; // Essential for authenticated actions
  device?: string;
}

declare global {
  namespace Express {
    interface Request {
      session?: {
        sessionId: string;
        visitorId: string;
        type: SessionType;
        customerId?: string;
      };
    }
  }
}

export interface CreateSessionInput {
  visitorId: string;
  customerId?: string;
  type: SessionType;
  ipAddress: string;
  userAgent: string;
  country?: string;
  device?: string;
  city?: string;
  browser?: string;
  os?: string;
  sessionId: string;
}

export interface CreateSessionEventInput {
  sessionId: string;
  eventType: string;
  page?: string;
  productId?: string;
  metadata?: Record<string, any>;
}
