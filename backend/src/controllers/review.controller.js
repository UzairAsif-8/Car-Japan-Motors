/**
 * Review controller.
 *  - Public:  submit a review (always PENDING) + list APPROVED reviews.
 *  - Admin:   list all + approve / reject (moderation).
 */
import prisma from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

/** Shared builder for the optional presentation fields. */
const presentationFields = (body) => ({
  role: typeof body.role === 'string' ? body.role.trim() : '',
  avatar: typeof body.avatar === 'string' ? body.avatar.trim() : '',
});

// POST /api/reviews  (public) — always created as PENDING
export const createReview = asyncHandler(async (req, res) => {
  const { name, rating, comment } = req.body;

  const review = await prisma.review.create({
    data: {
      name: name.trim(),
      rating, // validated to 1–5 integer by middleware
      comment: comment.trim(),
      ...presentationFields(req.body),
      status: 'PENDING',
    },
  });

  res.status(201).json({
    success: true,
    message: 'Thank you! Your review has been submitted for approval.',
    data: review,
  });
});

// POST /api/admin/reviews  (admin) — admin-curated testimonial, created APPROVED
export const adminCreateReview = asyncHandler(async (req, res) => {
  const { name, rating, comment } = req.body;

  const review = await prisma.review.create({
    data: {
      name: name.trim(),
      rating, // validated by middleware
      comment: comment.trim(),
      ...presentationFields(req.body),
      status: 'APPROVED',
    },
  });

  res.status(201).json({ success: true, message: 'Review published', data: review });
});

// DELETE /api/admin/reviews/:id  (admin)
export const deleteReview = asyncHandler(async (req, res) => {
  const existing = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!existing) throw ApiError.notFound('Review not found');
  await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Review deleted', id: req.params.id });
});

// GET /api/reviews  (public) — only APPROVED
export const getApprovedReviews = asyncHandler(async (_req, res) => {
  const reviews = await prisma.review.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, count: reviews.length, data: reviews });
});

// GET /api/admin/reviews  (admin) — all, optional ?status= filter
export const getAllReviews = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const where = {};
  if (status) {
    const upper = String(status).toUpperCase();
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(upper)) {
      throw ApiError.badRequest('Invalid status filter');
    }
    where.status = upper;
  }
  const reviews = await prisma.review.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, count: reviews.length, data: reviews });
});

/** Shared status updater for approve/reject. */
async function setStatus(id, status) {
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Review not found');
  return prisma.review.update({ where: { id }, data: { status } });
}

// PATCH /api/reviews/:id/approve  (admin)
export const approveReview = asyncHandler(async (req, res) => {
  const review = await setStatus(req.params.id, 'APPROVED');
  res.json({ success: true, message: 'Review approved', data: review });
});

// PATCH /api/reviews/:id/reject  (admin)
export const rejectReview = asyncHandler(async (req, res) => {
  const review = await setStatus(req.params.id, 'REJECTED');
  res.json({ success: true, message: 'Review rejected', data: review });
});
