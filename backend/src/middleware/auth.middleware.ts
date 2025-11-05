import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    } catch(error) {
        return res.status(400).json({ message: "Invalid token." });
    }
};