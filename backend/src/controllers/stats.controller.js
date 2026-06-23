/**
 * Admin dashboard aggregate counts — all values from the database.
 */
import prisma from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/admin/stats/dashboard
export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [totalCars, available, sold, upcoming, totalInquiries, totalReviews] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: 'AVAILABLE' } }),
    prisma.car.count({ where: { status: 'SOLD' } }),
    prisma.car.count({ where: { status: 'UPCOMING' } }),
    prisma.inquiry.count(),
    prisma.review.count(),
  ]);

  res.json({
    success: true,
    data: { totalCars, available, sold, upcoming, totalInquiries, totalReviews },
  });
});
