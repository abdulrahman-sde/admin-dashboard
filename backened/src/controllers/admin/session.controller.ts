import type { Request, Response, NextFunction } from "express";
import { sessionService } from "../../services/session.service.js";
import { successResponse } from "../../utils/response.js";

export const getSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessions = await sessionService.getAllSessions();
  res
    .status(200)
    .json(successResponse(sessions, "Sessions retrieved successfully"));
};
