import { Router, Request, Response } from "express";
import { Platform } from "@prisma/client";
import prisma from '../config/db';
import { authMiddleware } from "../middleware/auth.middleware";
import { syncCodeforcesData } from "../services/codeforcesService";

const router = Router();

/**
 * @desc Get profile of currently authenticated user
 * @route GET api/v1/users/me
 * @access Private
 */
router.get('/users/me', authMiddleware, async (req: Request, res: Response) => {
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
});

router.post('/sync/codeforces', authMiddleware, async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const profile = await prisma.platformProfile.findUnique({
        where: {
            userId_platform: {
                userId: userId,
                platform: Platform.CODEFORCES,
            },
        },
    });
    if (!profile || !profile.handle) {
        return res.status(404).json({ error: 'Codeforces handle is not linked.' });
    }
    try {
        const result = await syncCodeforcesData(userId, profile.handle);

        return res.status(200).json({
            message: `Synced data for ${profile.handle}.`,
            ...result,
        });

    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Codeforces Sync Failed:', errorMessage);

        return res.status(500).json({
            error: 'Synchronization failed.',
            details: errorMessage,
            // Simple warning reminder
            warning: 'Sync is slow and blocking! We must implement background jobs soon.',
        });
    }
})

export default router;