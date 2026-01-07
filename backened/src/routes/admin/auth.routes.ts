import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authController from "../../controllers/admin/auth.controller.js";
import { authenticateAdmin } from "../../middlewares/auth/admin.auth.js";
const router = Router();

router.post("/login", asyncHandler(authController.login));
router.post("/register", asyncHandler(authController.register));
router.post("/logout", authenticateAdmin, asyncHandler(authController.logout));
router.post("/refresh", asyncHandler(authController.refresh));
router.get("/me", authenticateAdmin, asyncHandler(authController.getMe));
router.patch(
  "/profile",
  authenticateAdmin,
  asyncHandler(authController.updateProfile)
);
router.patch(
  "/change-password",
  authenticateAdmin,
  asyncHandler(authController.changePassword)
);

export default router;
