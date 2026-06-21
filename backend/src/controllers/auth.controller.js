/**
 * Auth controller — single-admin login.
 */
import prisma from '../config/db.js';
import { comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase().trim() } });

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
