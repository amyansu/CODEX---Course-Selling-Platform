
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
    name: string;
    role: "user" | "admin";
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1. Get token from request headers
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication token required",
            });
        }

        const token = authHeader.split(" ")[1];

        // 2. Get JWT secret
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is missing");
        }

        // 3. Verify token
        const decoded = jwt.verify(token, secret) as JwtPayload;

        // 4. Attach user information to request
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

export const authorizeAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only.",
        });
    }

    next();
};
