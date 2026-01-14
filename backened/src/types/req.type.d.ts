import type { SessionType } from "./session.types.js";

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
