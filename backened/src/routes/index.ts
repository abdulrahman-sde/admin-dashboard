import { Router } from "express";
import adminRoutes from "./admin/index.js";
import storefrontRoutes from "./storefront/index.js";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/", storefrontRoutes);

export default router;
