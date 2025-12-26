import jwt from "jsonwebtoken";
import type { JWTPayload } from "../types/auth.types.js";

/**
 * Generate access and refresh tokens for users or customers
 */
export const generateTokens = (payload: JWTPayload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    "userId" in payload
      ? { userId: payload.userId, type: payload.type }
      : { customerId: payload.customerId, type: payload.type },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
};
