/**
 * Auth controller — single-admin login and account management.
 */
import prisma from '../config/db.js';
import { comparePassword, hashPassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

function normalizeEmail(email) {
  return email.toLowerCase().trim();
}

async function loadAdminWithPassword(id) {
  return prisma.admin.findUnique({
    where: { id },
    select: { id: true, email: true, password: true },
  });
}

async function verifyCurrentPassword(admin, currentPassword) {
  if (!admin || !(await comparePassword(currentPassword, admin.password))) {
    throw ApiError.unauthorized('Current password is incorrect');
  }
}

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({
    where: { email: normalizeEmail(email) },
  });

  // Use a uniform error to avoid leaking which field was wrong.
  if (!admin || !(await comparePassword(password, admin.password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken({ sub: admin.id, email: admin.email });

  res.json({
    success: true,
    token,
    user: { id: admin.id, email: admin.email },
  });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.admin.id,
      email: req.admin.email,
    },
  });
});

// PUT /api/auth/change-email
export const changeEmail = asyncHandler(async (req, res) => {
  const { currentEmail, newEmail, currentPassword } = req.body;
  const normalizedCurrent = normalizeEmail(currentEmail);
  const normalizedNew = normalizeEmail(newEmail);

  const admin = await loadAdminWithPassword(req.admin.id);
  if (!admin) throw ApiError.unauthorized('Account no longer exists');

  await verifyCurrentPassword(admin, currentPassword);

  if (normalizedCurrent !== admin.email) {
    throw ApiError.badRequest('Current email does not match your account', {
      currentEmail: 'Current email does not match your account',
    });
  }

  if (normalizedNew === admin.email) {
    throw ApiError.badRequest('New email must be different from your current email', {
      newEmail: 'New email must be different from your current email',
    });
  }

  const existing = await prisma.admin.findUnique({ where: { email: normalizedNew } });
  if (existing) {
    throw ApiError.badRequest('This email is already in use', {
      newEmail: 'This email is already in use',
    });
  }

  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data: { email: normalizedNew },
    select: { id: true, email: true },
  });

  const token = signToken({ sub: updated.id, email: updated.email });

  res.json({
    success: true,
    message: 'Email updated successfully',
    token,
    data: { email: updated.email },
  });
});

// PUT /api/auth/change-password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await loadAdminWithPassword(req.admin.id);
  if (!admin) throw ApiError.unauthorized('Account no longer exists');

  await verifyCurrentPassword(admin, currentPassword);

  if (await comparePassword(newPassword, admin.password)) {
    throw ApiError.badRequest('Validation failed', {
      newPassword: 'New password must be different from your current password',
    });
  }

  const hashed = await hashPassword(newPassword);

  await prisma.admin.update({
    where: { id: admin.id },
    data: { password: hashed },
  });

  const token = signToken({ sub: admin.id, email: admin.email });

  res.json({
    success: true,
    message: 'Password updated successfully',
    token,
  });
});
