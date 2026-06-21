/**
 * JWT helpers — sign and verify admin access tokens.
 */
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!SECRET && process.env.NODE_ENV !== 'test') {
  // Fail loud and early rather than issuing insecure tokens.
  console.warn('⚠️  JWT_SECRET is not set. Set it in your .env file.');
}

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
