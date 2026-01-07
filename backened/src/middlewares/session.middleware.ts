import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { getSession, updateSessionActivity } from "../utils/redis.utils.js";
import { getNormalizedHeaders } from "../utils/header.utils.js";
import { sessionService } from "../services/session.service.js";

export const sessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.cookies?.session;
    if (sessionId) {
      const session = await getSession(sessionId);
      if (session) {
        updateSessionActivity(sessionId);

        res.cookie("session", sessionId, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 30 * 60 * 1000, // 30 minutes
        });

        await updateSessionActivity(sessionId);

        req.session = {
          sessionId: session?.sessionId,
          visitorId: session?.visitorId,
          type: session?.type,
        };

        return next();
      }
    }

    const { userAgent, country, city, device, browser, os, ip } =
      getNormalizedHeaders(req);
    const visitorId = req.cookies?.visitorId || crypto.randomUUID();

    const session = await sessionService.createSession({
      data: {
        ipAddress: ip,
        userAgent,
        country,
        sessionId: crypto.randomUUID(),
        visitorId,
        type: "ANONYMOUS",
        device,
        city,
        browser,
        os,
      },
    });

    req.session = {
      sessionId: session.sessionId,
      visitorId,
      type: "ANONYMOUS",
    };

    res.cookie("session", session.sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 60 * 1000, // 30 minutes
    });

    res.cookie("visitorId", visitorId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    next();
  } catch (error) {
    console.error("Session middleware error:", error);
    next();
  }
};
