import jwt from "jsonwebtoken";
import type { JWTPayload } from "../types/auth.types.js";

export const generateTokens = (payload: JWTPayload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { userId: payload.userId, type: payload.type },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
};
