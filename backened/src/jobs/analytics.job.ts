import cron from "node-cron";
import { cronService } from "../services/cron.service.js";

/**
 * Analytics Job
 * Responsible for scheduling the analytics related background tasks.
 */
export const analyticsJob = {
  /**
   * Initializes the schedules for analytics jobs.
   */
  init() {
    // Schedule daily analytics job to run every day at 00:05 AM
    cron.schedule("5 0 * * *", async () => {
      console.log("📅 [Job Trigger] Executing Daily Analytics Schedule...");
      await cronService.runDailyAnalyticsAggregation();
    });
  },
};
