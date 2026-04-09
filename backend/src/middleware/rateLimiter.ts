import { Request, Response, NextFunction } from "express";
import redis from "../config/redis";

interface RateLimitOptions {
    windowInSeconds: number;
    maxRequests: number;
    keyPrefix?: string;
}

export const rateLimiter = (options: RateLimitOptions) => {
    const {
        windowInSeconds,
        maxRequests,
        keyPrefix = "rate",
    } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        if (process.env.NODE_ENV === "test") {
            return next();
        }

        try {
            const identifier = req.user?.id || req.ip || "anonymous";
            const key = `${keyPrefix}:${identifier}`;

            const current = await redis.incr(key);

            if (current === 1) {
                await redis.expire(key, windowInSeconds);
            }

            if (current > maxRequests) {
                return res.status(429).json({
                    message: "Too many requests",
                });
            }

            res.setHeader("X-RateLimit-Limit", maxRequests);
            res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - current));

            next();
        } catch (error) {
            console.error("Rate limiter error:", error);
            next();
        }
    };
};