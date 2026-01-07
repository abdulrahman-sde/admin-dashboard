import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  console.warn(
    "⚠️ Redis configuration missing. UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not found."
  );
}

export const redis = new Redis({
  url: redisUrl || "",
  token: redisToken || "",
});
