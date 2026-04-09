import { Request, Response, NextFunction } from "express";
import redis from "../config/redis"

export const cacheMiddleware = (ttl: number = 60) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const key = `cache:${req.originalUrl}`;
        const cached = await redis.get(key);

        if (cached) {
            return res.json(JSON.parse(cached));
        }

        const originalJson = res.json.bind(res);

        res.json = (body: any) => {
            redis.set(key, JSON.stringify(body), "EX", ttl);
            return originalJson(body);
        };

        next();
    };
};