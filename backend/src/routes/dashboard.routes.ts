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

/**
 * GET /api/v1/dashboard/rating
 * Fetches rating history for the user's Codeforces profile.
 */
dashboardRouter.get('/dashboard/rating', authMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required.' });

    try {
        const history = await prisma.ratingHistory.findMany({
            where: {
                profile: {
                    userId: userId,
                    platform: 'CODEFORCES'
                }
            },
            orderBy: { date: 'asc' },
            select: {
                rating: true,
                date: true,
                contestName: true
            }
        });

        // Format for Recharts (date as string)
        const formattedHistory = history.map(h => ({
            rating: h.rating,
            date: h.date.toISOString().split('T')[0], // YYYY-MM-DD
            contestName: h.contestName
        }));

        res.json(formattedHistory);
    } catch (error) {
        console.error('Error fetching rating history:', error);
        res.status(500).json({ message: 'Failed to fetch rating history.' });
    }
});

/**
 * GET /api/v1/dashboard/activity
 * Fetches submission activity for the heatmap.
 */
dashboardRouter.get('/dashboard/activity', authMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required.' });

    try {
        // Fetch all submission dates
        const submissions = await prisma.submission.findMany({
            where: { userId: userId },
            select: { submittedAt: true }
        });

        // Aggregate by date
        const activityMap = new Map<string, number>();
        submissions.forEach(sub => {
            const date = sub.submittedAt.toISOString().split('T')[0];
            activityMap.set(date, (activityMap.get(date) || 0) + 1);
        });

        // Convert to array for heatmap
        const activityData = Array.from(activityMap.entries()).map(([date, count]) => ({
            date,
            count
        }));

        res.json(activityData);
    } catch (error) {
        console.error('Error fetching activity data:', error);
        res.status(500).json({ message: 'Failed to fetch activity data.' });
    }
});

export default dashboardRouter;