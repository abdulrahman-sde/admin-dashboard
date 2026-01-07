import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.set("trust proxy", true);
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === "development" || !origin) {
        callback(null, true);
        return;
      }
      const allowedOrigins = [
        "https://ecommerce-admin-da-git-009232-abdulrehman-codecrafters-projects.vercel.app",
        "https://ecommerce-admin-dashboard-two-beige.vercel.app",
        "https://dealport-frontened-powy.vercel.app",
      ];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

export default app;
