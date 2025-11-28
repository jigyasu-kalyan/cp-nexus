import { Request, Response } from "express";
import prisma from "../config/db";
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/profiles/link', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { platform, handle } = req.body;
        const userId = req.user!.id;

        if (!platform || !handle) {
            return res.status(400).json({ message: "Invalid platform or handle provided." });
        }

        const platformProfile = await prisma.platformProfile.upsert({
            where: {
                userId_platform: {
                    userId: userId, 
                    platform: platform,
                },
            },
            update: {
                handle: handle,
                lastSync: new Date(),
            },
            create: {
                userId: userId,
                platform: platform,
                handle: handle,
                lastSync: new Date(),
            },
        });

        console.log(`[SYNC_TODO]: Add profile ${platformProfile.id} to BullMQ`);
        return res.status(201).json(platformProfile);
    } catch (error: any) {
        if (error.code == 'P2002') {
            return res.status(409).json({ message: 'This profile is already linked.' });
        }
        console.error(`Error linking profile: ${error}`);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router;