import type { Response, NextFunction } from "express";
import { verifyToken } from "../../lib/jwt.js";
import { UnauthorizedError } from "../../utils/errors.js";
import type { CustomerAuthRequest } from "../../types/auth.types.js";

/**
 * Customer Authentication Middleware
 * Verifies JWT token and ensures user is a customer
 */
export const authenticateCustomer = async (
  req: CustomerAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = verifyToken(token);

    // Check if token is for customer
    if (payload.type !== "customer") {
      throw new UnauthorizedError("Customer access required");
    }

    // Attach customer to request
    req.customer = {
      id: payload.customerId,
      email: payload.email,
      role: payload.role,
      isGuest: payload.isGuest,
    };

    next();
  } catch (error) {
    next(error);
  }
};
