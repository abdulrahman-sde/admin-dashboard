import { Router } from "express";
import orderRoutes from "./orders.route.js";
import couponRoutes from "./coupons.routes.js";
import sessionRoutes from "./session.routes.js";
import reviewsRoutes from "./reviews.routes.js";
import { sessionMiddleware } from "../../middlewares/session.middleware.js";

const router = Router();

// Public storefront routes
router.use(sessionMiddleware);
router.use("/orders", orderRoutes);
router.use("/coupons", couponRoutes);
router.use("/session", sessionRoutes);
router.use("/reviews", reviewsRoutes);

export default router;
