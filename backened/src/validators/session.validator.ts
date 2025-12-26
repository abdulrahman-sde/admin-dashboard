import { z } from "zod";

export const CreateSessionEventSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  sessionId: z.string().uuid("Invalid Session ID format"),
  page: z.string().optional(),
  productId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});
