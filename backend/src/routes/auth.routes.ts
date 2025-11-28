import { Router } from 'express';
import { Request, Response } from "express";
import prisma from "../config/db";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post('/auth/register', async (req: Request, res: Response) => {

    try {
        const { email, username, password } = req.body;

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }]},
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email or username already exists" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                passwordHash,
            },
        });

        const { passwordHash: _, ...userWithoutPassword } = user;

        return res.status(201).json({ userWithoutPassword });
    } catch (error) {
        console.log(`Registration error: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }

});

router.post('/auth/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const signOptions: SignOptions = {};
        const expires = process.env.JWT_EXPIRES_IN ?? '1d';
        signOptions.expiresIn = expires as unknown as SignOptions["expiresIn"];

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            signOptions 
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        });
    } catch(error) {
        console.log(`Login error: ${error}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;