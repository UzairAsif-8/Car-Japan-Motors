/**
 * Password hashing helpers.
 *
 * Uses `bcryptjs` — a pure-JS, API-compatible implementation of bcrypt. It
 * avoids native build toolchains, which makes it far smoother on Windows and
 * serverless platforms (Neon/Vercel/Render) while remaining cryptographically
 * equivalent for our use.
 */
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
