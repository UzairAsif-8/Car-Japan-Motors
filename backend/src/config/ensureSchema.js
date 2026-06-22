/**
 * Idempotent schema patches for production when a migration was deployed
 * before `prisma migrate deploy` ran against Neon.
 */
import prisma from './db.js';

export async function ensureSchema() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Admin"
    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `);
}
