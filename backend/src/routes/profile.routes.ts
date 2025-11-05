import { Router } from 'express';
import { linkProfile } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/profiles/link', authMiddleware, linkProfile);

export default router;