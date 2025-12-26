import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import "./jobs/calculateDailyMetrics.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.set("trust proxy", true);
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://ecommerce-admin-da-git-009232-abdulrehman-codecrafters-projects.vercel.app",
      "https://ecommerce-admin-dashboard-two-beige.vercel.app",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
