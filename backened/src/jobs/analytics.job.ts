import cron from "node-cron";
import { cronService } from "../services/cron.service.js";

export const analyticsJob = {
  init() {
    cron.schedule("5 0 * * *", async () => {
      await cronService.runDailyAnalyticsAggregation();
    });
  },
};
