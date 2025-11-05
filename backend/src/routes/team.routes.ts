import { Router } from "express";
import { createTeam, getTeamById, getMyTeams } from "../controllers/team.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post('/teams', authMiddleware, createTeam);
router.get('/team/:teamId', authMiddleware, getTeamById);
router.get('/teams', authMiddleware, getMyTeams);

export default router;