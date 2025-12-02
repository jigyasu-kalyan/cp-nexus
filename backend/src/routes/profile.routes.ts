import { Request, Response } from "express";
import prisma from "../config/db";
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { syncCodeforcesData } from '../services/codeforcesService';

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

        // Trigger initial sync
        if (platform === 'CODEFORCES') {
            try {
                // We don't await this to avoid blocking the response? 
                // Actually, for now let's await it or at least catch it so it doesn't crash
                // The user might want immediate feedback.
                // Let's await it for the MVP as per plan.
                await syncCodeforcesData(userId, handle);
            } catch (syncError) {
                console.error(`Initial sync failed for ${handle}:`, syncError);
                // We still return success for the linking itself, but maybe with a warning?
                // For now, just log it.
            }
        }

        return res.status(201).json(platformProfile);
    } catch (error: any) {
        if (error.code == 'P2002') {
            return res.status(409).json({ message: 'This profile is already linked.' });
        }
        console.error(`Error linking profile: ${error}`);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

router.delete('/profiles/unlink/:platform', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { platform } = req.params;
        const userId = req.user!.id;

        if (!platform) {
            return res.status(400).json({ message: "Platform is required." });
        }

        // Validate platform enum if needed, but Prisma will throw if invalid enum is used in where clause?
        // Actually Prisma expects specific Enum type. Let's cast or validate.
        // For simplicity, we assume the string matches. If not, Prisma might error or delete nothing.
        // Ideally we should validate against Platform enum.

        // 1. Delete PlatformProfile
        try {
            await prisma.platformProfile.delete({
                where: {
                    userId_platform: {
                        userId: userId,
                        platform: platform as any,
                    },
                },
            });
        } catch (e: any) {
            if (e.code === 'P2025') {
                return res.status(404).json({ message: 'Profile not found.' });
            }
            throw e;
        }

        // 2. Delete Submissions for this platform
        const deletedSubmissions = await prisma.submission.deleteMany({
            where: {
                userId: userId,
                platform: platform as any,
            },
        });

        console.log(`Unlinked ${platform} for user ${userId}. Deleted ${deletedSubmissions.count} submissions.`);

        return res.status(200).json({ message: 'Unlinked successfully.' });

    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Profile not found.' });
        }
        console.error(`Error unlinking profile: ${error}`);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router;