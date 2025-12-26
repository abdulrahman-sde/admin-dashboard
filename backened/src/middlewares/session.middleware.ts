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
    // console.log("middleware recieved session cookie (seesion id)", sessionId);
    if (sessionId) {
      // console.log("session cookie is provided checking session from redis");
      const session = await getSession(sessionId);
      if (session) {
        // console.log("session cache hit so setting req.session");
        updateSessionActivity(sessionId);

        res.cookie("session", sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
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

    // console.log("session cookie id not provided creating a new session");
    const { userAgent, country, city, device, browser, os, ip } =
      getNormalizedHeaders(req);
    const visitorId = req.cookies?.visitorId || crypto.randomUUID();

    const session = await sessionService.createSession({
      data: {
        ipAddress: ip,
        userAgent,
        // customerId,
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

    console.log("newly created session", session);

    req.session = {
      sessionId: session.sessionId,
      visitorId,
      type: "ANONYMOUS",
      // ipAddress, userAgent no longer needed in hot state
    };

    res.cookie("session", session.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000, // 30 minutes
    });

    // Visitor ID should be long-lived (e.g., 1 year)
    res.cookie("visitorId", visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    next();
  } catch (error) {
    console.error("Session middleware error:", error);
    // If we can't create a session, we probably shouldn't continue to the controller if it depends on it.
    // However, for now, let's see the error.
    next();
  }
};
