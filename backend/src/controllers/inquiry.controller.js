/**
 * Inquiry controller.
 *  - Public:  create a lead (form submission or WhatsApp conversion click).
 *  - Admin:   list all leads + update status.
 */
import prisma from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

// POST /api/inquiries  (public)
export const createInquiry = asyncHandler(async (req, res) => {
  const { name, phone, message, carId, email } = req.body;

  // If a carId is supplied, make sure it exists before linking.
  if (carId) {
    const car = await prisma.car.findUnique({ where: { id: carId }, select: { id: true } });
    if (!car) throw ApiError.badRequest('Referenced car does not exist');
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name: name.trim(),
      phone: phone.trim(),
      email: typeof email === 'string' ? email.trim() : '',
      message: message.trim(),
      carId: carId || null,
      status: 'NEW',
    },
  });

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been received. Our team will reach out shortly.',
    data: inquiry,
  });
});

// GET /api/admin/inquiries  (admin) — optional ?status= filter
export const getInquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const where = {};
  if (status) {
    const upper = String(status).toUpperCase();
    if (!['NEW', 'CONTACTED', 'CLOSED'].includes(upper)) {
      throw ApiError.badRequest('Invalid status filter');
    }
    where.status = upper;
  }

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { car: { select: { id: true, title: true, model: true } } },
  });

  res.json({ success: true, count: inquiries.length, data: inquiries });
});

// PATCH /api/inquiries/:id/status  (admin)
export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // validated by middleware

  const existing = await prisma.inquiry.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Inquiry not found');

  const inquiry = await prisma.inquiry.update({ where: { id }, data: { status } });
  res.json({ success: true, message: 'Inquiry status updated', data: inquiry });
});
