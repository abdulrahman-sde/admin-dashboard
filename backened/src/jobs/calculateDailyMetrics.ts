import cron from "node-cron";
import { getTodayRange, getYesterdayRange } from "../utils/date.utils.js";
import { analyticsService } from "../services/analytics.service.js";

const calculateDailyMetrics = async () => {
  const { startOfDay, endOfDay } = getTodayRange();
  try {
    await analyticsService.calculateAndSaveDailyMetrics(startOfDay, endOfDay);
  } catch (error) {
    console.error("Error calculating daily metrics:", error);
  }
};

// Run at 00:05 AM every day
cron.schedule("5 0 * * *", calculateDailyMetrics);

if (process.env.NODE_ENV !== "production") {
  // calculateDailyMetrics();
}
