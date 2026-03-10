import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const getTokenFromHeader = (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return null;

    // Separating "Bearer" and the token from header
    const token = authHeader.split(" ")[1];
    return token || null;
};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getTokenFromHeader(req);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized. Token not found." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
}

export default authMiddleware;