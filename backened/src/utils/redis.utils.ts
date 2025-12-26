// src/utils/redis.utils.ts
import { redis } from "../config/redis.js";
import type { RedisSessionData } from "../types/session.types.js";
import type { DashboardWeeklyStats } from "../types/analytics.types.js";

export async function getSession(
  sessionId: string
): Promise<RedisSessionData | null> {
  return await redis.get(`session:${sessionId}`);
}

export async function setSession(
  sessionId: string,
  data: RedisSessionData,
  ttl: number
) {
  await redis.set(`session:${sessionId}`, JSON.stringify(data), { ex: ttl });
}

export async function deleteSession(sessionId: string) {
  await redis.del(`session:${sessionId}`);
}

// Refresh TTL only - efficient O(1) operation
export async function updateSessionActivity(sessionId: string) {
  // Just extend the life of the key. No need to fetch/update body.
  // 30 * 60 = 1800 seconds
  await redis.expire(`session:${sessionId}`, 30 * 60);
}

export async function getWeeklyStats(
  dateKey: string
): Promise<DashboardWeeklyStats | null> {
  const data = await redis.get(`analytics:weekly-stats:${dateKey}`);
  if (typeof data === "string") return JSON.parse(data);
  return data as DashboardWeeklyStats | null;
}

export async function setWeeklyStats(
  dateKey: string,
  data: DashboardWeeklyStats,
  ttl: number = 3600 // Default 1 hour
) {
  await redis.set(`analytics:weekly-stats:${dateKey}`, JSON.stringify(data), {
    ex: ttl,
  });
}
