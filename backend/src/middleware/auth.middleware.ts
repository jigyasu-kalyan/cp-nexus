import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

declare module 'express' {
    interface Request {
        user?: { id: string };
    }
}

interface JwtPayload {
    userId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Try to get token from Authorization header first (Bearer token)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    
    // Fallback to cookies if Authorization header is not present
    const cookieToken = token || req.cookies?.jwtToken;

    if (!cookieToken) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET!) as JwtPayload;
        // Map userId from token to id for req.user
        req.user = { id: decoded.userId };
        next();
    } catch(error) {
        return res.status(400).json({ message: "Invalid token." });
    }
};