import geoip from "geoip-lite";
import requestIpAlt from "request-ip";
import type { Request } from "express";
import { UAParser } from "ua-parser-js";

export const getNormalizedHeaders = (req: Request) => {
  const userAgentString = req.get("user-agent") || "";
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  const ip = requestIpAlt.getClientIp(req) || "";
  const geo = geoip.lookup(ip);

  let deviceType = "other";

  if (result.device.type) {
    deviceType = result.device.type;
  } else if (result.os.name) {
    const osName = result.os.name.toLowerCase();

    if (osName.includes("mac") || osName.includes("os x")) {
      deviceType = "laptop"; // or "desktop" - MacBooks are typically laptops
    } else if (
      osName.includes("windows") ||
      osName.includes("linux") ||
      osName.includes("ubuntu") ||
      osName.includes("chrome os")
    ) {
      deviceType = "laptop"; // Most desktop OS usage is on laptops nowadays
    } else if (osName.includes("android") || osName.includes("ios")) {
      deviceType = "mobile";
    }
  }
  return {
    userAgent: userAgentString,
    country: geo?.country,
    city: geo?.city,
    device: deviceType,
    browser: result.browser.name,
    os: result.os.name,
    ip: ip,
  };
};
