import { Router } from 'express';
import {
  createReview,
  adminCreateReview,
  deleteReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  rejectReview,
} from '../controllers/review.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validateReview } from '../middlewares/validate.middleware.js';

// Mounted at /api — paths reflect the full contract.
const router = Router();

// Public
router.post('/reviews', validateReview, createReview); // always PENDING
router.get('/reviews', getApprovedReviews); // only APPROVED

// Admin (moderation + curated testimonials)
router.get('/admin/reviews', authMiddleware, getAllReviews);
router.post('/admin/reviews', authMiddleware, validateReview, adminCreateReview); // created APPROVED
router.delete('/admin/reviews/:id', authMiddleware, deleteReview);
router.patch('/reviews/:id/approve', authMiddleware, approveReview);
router.patch('/reviews/:id/reject', authMiddleware, rejectReview);

export default router;
