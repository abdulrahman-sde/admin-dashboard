import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { analyticsJob } from "./jobs/analytics.job.js";

// Initialize Cron Jobs
analyticsJob.init();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
