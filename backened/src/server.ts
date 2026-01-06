import app from "./app.js";
import dotenv from "dotenv";
import { analyticsJob } from "./jobs/analytics.job.js";

// Initialize Cron Jobs
analyticsJob.init();
dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
