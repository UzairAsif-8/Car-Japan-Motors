import { Router } from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
} from '../controllers/inquiry.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validateInquiry, validateInquiryStatus } from '../middlewares/validate.middleware.js';

// Mounted at /api — paths reflect the full contract.
const router = Router();

// Public
router.post('/inquiries', validateInquiry, createInquiry);

// Admin
router.get('/admin/inquiries', authMiddleware, getInquiries);
router.patch('/inquiries/:id/status', authMiddleware, validateInquiryStatus, updateInquiryStatus);

export default router;
