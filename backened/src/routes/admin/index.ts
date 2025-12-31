import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoriesRoutes from "./categories.routes.js";
import productsRoutes from "./products.routes.js";
import customersRoutes from "./customers.routes.js";
import searchRoutes from "./search.routes.js";
import ordersRoutes from "./orders.route.js";
import transactionsRoutes from "./transactions.routes.js";
import couponsRoutes from "./coupons.routes.js";
import sessionRoutes from "./session.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import paymentMethodsRoutes from "./payment-methods.routes.js";
import monthlyGoalsRoutes from "./monthly-goals.routes.js";
import aiRoutes from "./ai.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/categories", categoriesRoutes);
router.use("/products", productsRoutes);
router.use("/customers", customersRoutes);
router.use("/search", searchRoutes);
router.use("/orders", ordersRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/coupons", couponsRoutes);
router.use("/sessions", sessionRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/payment-methods", paymentMethodsRoutes);
router.use("/monthly-goals", monthlyGoalsRoutes);
router.use("/ai", aiRoutes);

export default router;
