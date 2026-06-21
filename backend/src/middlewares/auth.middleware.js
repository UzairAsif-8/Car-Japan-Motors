/**
 * JWT authentication guard. Protects all admin-only routes.
 * Expects: `Authorization: Bearer <token>`.
 */
import { verifyToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';
import prisma from '../config/db.js';

export default async function authMiddleware(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw ApiError.unauthorized('Missing or malformed authorization header');
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      throw ApiError.unauthorized('Invalid or expired token');
    }

    // Ensure the admin still exists (token could outlive the account).
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true },
    });
    if (!admin) throw ApiError.unauthorized('Account no longer exists');

    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
}
