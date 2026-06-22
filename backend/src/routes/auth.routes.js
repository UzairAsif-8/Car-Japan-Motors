import { Router } from 'express';
import { login, getMe, changeEmail, changePassword } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  validateLogin,
  validateChangeEmail,
  validateChangePassword,
} from '../middlewares/validate.middleware.js';

const router = Router();

// POST /api/auth/login
router.post('/login', validateLogin, login);

// GET /api/auth/me
router.get('/me', authMiddleware, getMe);

// PUT /api/auth/change-email
router.put('/change-email', authMiddleware, validateChangeEmail, changeEmail);

// PUT /api/auth/change-password
router.put('/change-password', authMiddleware, validateChangePassword, changePassword);

export default router;
