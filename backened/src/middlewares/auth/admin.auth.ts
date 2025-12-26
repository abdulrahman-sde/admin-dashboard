import type { Response, NextFunction } from "express";
import { verifyToken } from "../../lib/jwt.js";
import { UnauthorizedError } from "../../utils/errors.js";
import type { AuthRequest } from "../../types/auth.types.js";

/**
 * Admin Authentication Middleware
 * Verifies JWT token and ensures user is an admin
 */
export const authenticateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = verifyToken(token);

    // Check if token is for admin
    if (payload.type !== "admin") {
      throw new UnauthorizedError("Admin access required");
    }

    // Attach user to request
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
