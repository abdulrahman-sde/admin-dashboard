import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authController from "../../controllers/admin/auth.controller.js";
const router = Router();

router.post("/login", asyncHandler(authController.login));
router.post("/register", asyncHandler(authController.register));
router.post("/logout", asyncHandler(authController.logout));

export default router;
