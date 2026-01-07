import dotenv from "dotenv";
dotenv.config();
import { redis } from "../src/config/redis.js";

async function flush() {
  try {
    console.log("Flushing Redis...");
    await redis.flushall();
    console.log("Redis flushed successfully");
  } catch (error) {
    console.error("Error flushing Redis:", error);
  }
  process.exit(0);
}

flush();
