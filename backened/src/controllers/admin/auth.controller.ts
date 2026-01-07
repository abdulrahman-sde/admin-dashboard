import type { Request, Response } from "express";
import type { AuthRequest } from "../../types/auth.types.js";
import { adminAuthService } from "../../services/admin.auth.service.js";
import { successResponse } from "../../utils/response.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../../utils/validators/auth.validator.js";

export const login = async (req: Request, res: Response): Promise<void> => {
  const validatedData = loginSchema.parse(req.body);

  const result = await adminAuthService.loginUser(validatedData);

  res
    .cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(successResponse(result, "Login successful"));
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const validatedData = registerSchema.parse(req.body);

  const result = await adminAuthService.registerUser(validatedData);

  res
    .status(201)
    .json(successResponse(result, "Admin user created successfully"));
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthRequest).user?.id;

  if (userId) {
    await adminAuthService.logoutUser(userId);
  }

  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(successResponse(null, "Logged out successfully"));
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ success: false, message: "No refresh token" });
    return;
  }

  const result = await adminAuthService.refreshToken(refreshToken);

  res
    .cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(successResponse(result, "Token refreshed"));
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    res.status(401).json({ success: false, message: "User not authenticated" });
    return;
  }

  const user = await adminAuthService.getUserProfile(userId);
  res.json(successResponse({ user }, "User profile fetched successfully"));
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: "User not authenticated" });
    return;
  }

  const validatedData = updateProfileSchema.parse(req.body);
  const user = await adminAuthService.updateProfile(userId, validatedData);

  res.json(successResponse({ user }, "Profile updated successfully"));
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: "User not authenticated" });
    return;
  }

  const validatedData = changePasswordSchema.parse(req.body);
  await adminAuthService.changePassword(userId, validatedData);

  res.json(successResponse(null, "Password changed successfully"));
};
