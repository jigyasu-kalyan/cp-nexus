import { Router } from 'express';
import { codeforcesService } from '../services/codeforcesService';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const contests = await codeforcesService.getUpcomingContests();
        res.json(contests);
    } catch (error) {
        console.error('Error fetching contests:', error);
        res.status(500).json({ error: 'Failed to fetch contests' });
    }
});

export default router;
