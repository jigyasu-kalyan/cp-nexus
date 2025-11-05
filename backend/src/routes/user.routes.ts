import { Router  } from "express";
import { getMe } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get('/users/me', authMiddleware, getMe);
export default router;