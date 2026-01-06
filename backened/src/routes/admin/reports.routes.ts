import { Router } from "express";
import {
  getReportsData,
  getCustomerDemographics,
  getTopCustomers,
  getTopProducts,
  getActiveSessions,
  getDeviceAnalytics,
} from "../../controllers/admin/reports.controller.js";

const router = Router();

// GET /api/admin/reports - Get filtered reports data
router.get("/", getReportsData);

// GET /api/admin/reports/demographics - Get customer demographics
router.get("/demographics", getCustomerDemographics);

// GET /api/admin/reports/top-customers - Get top customers
router.get("/top-customers", getTopCustomers);

// GET /api/admin/reports/top-products - Get top products
router.get("/top-products", getTopProducts);

// GET /api/admin/reports/active-sessions - Get active sessions from Redis
router.get("/active-sessions", getActiveSessions);

// GET /api/admin/reports/device-analytics - Get device breakdown
router.get("/device-analytics", getDeviceAnalytics);

export default router;
