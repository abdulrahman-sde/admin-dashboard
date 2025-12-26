import type { Request, Response } from "express";
import { adminAuthService } from "../../services/admin.auth.service.js";
import { successResponse } from "../../utils/response.js";
import {
  registerSchema,
  loginSchema,
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
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(successResponse(null, "Logged out successfully"));
};
