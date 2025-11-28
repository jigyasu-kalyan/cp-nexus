import { Router, Request, Response } from 'express';
import prisma from "../config/db";
import { authMiddleware } from '../middleware/auth.middleware';

const dashboardRouter = Router();

// Define a type for the response data for better safety
type DashboardStatsResponse = {
    username: string;
    cfHandle: string | null;
    totalProblemsSolved: number;
    lastSubmissionTime: string | null; 
};

/**
 * GET /api/v1/dashboard/stats
 * Fetches core dashboard statistics directly from the PostgreSQL database.
 */
dashboardRouter.get('/dashboard/stats', authMiddleware, async (req: Request, res: Response<DashboardStatsResponse | { message: string }>) => {
    // Cast req.user to the extended type to access 'id' safely
    const userId = req.user?.id; 

    if (!userId) {
        // Clears the "Property 'id' does not exist on type 'JwtPayload'" error
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        // Fetch User data and Aggregated Stats
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                platformProfiles: {
                    where: { platform: 'CODEFORCES' },
                    select: { handle: true },
                    take: 1,
                },
                _count: {
                    select: {
                        submissions: {
                            where: { verdict: 'ACCEPTED' }
                        }
                    }
                },
                submissions: {
                    orderBy: {
                        submittedAt: 'desc' 
                    },
                    take: 1,
                    select: {
                        submittedAt: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Aggregate and format the data for the frontend
        const dashboardData: DashboardStatsResponse = {
            username: user.username,
            // Extract the Codeforces handle safely
            cfHandle: user.platformProfiles[0]?.handle || null, 
            // Access the count result
            totalProblemsSolved: user._count.submissions, 
            // Access the most recent submission time using submittedAt
            lastSubmissionTime: user.submissions[0]?.submittedAt?.toISOString() || null
        };

        res.json(dashboardData);

    } catch (error) {
        console.error('Prisma Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Internal Server Error during data retrieval.' });
    }
});

export default dashboardRouter;