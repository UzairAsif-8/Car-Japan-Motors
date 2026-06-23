import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getDashboardStats } from '../controllers/stats.controller.js';

const router = Router();

router.get('/dashboard', authMiddleware, getDashboardStats);

export default router;
