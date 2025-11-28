import { Request, Response } from "express";
import prisma from '../config/db';

/**
 * @desc Get profile of currently authenticated user
 * @route GET api/v1/users/me
 * @access Private
 */

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { passwordHash: _, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.log(`Error in getMe controller: ${error}`);
        return res.status(500).json({ message: "Internal server error." });
    }
}