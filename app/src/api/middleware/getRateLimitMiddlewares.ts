import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

const getIP = (request: Request, res: Response): string =>
  (request.ip ||
    request.headers["x-forwarded-for"] ||
    request.headers["x-real-ip"] ||
    request.connection.remoteAddress) as string;

export const getRateLimitMiddlewares = ({
  limit = 10,
  windowMs = 10 * 1000,
  delayAfter = Math.round(10 / 2),
  delayMs = 500,
} = {}) => [
  // slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
  rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
];
