-- Add presentation fields to Review (admin testimonials) and email to Inquiry.
-- All NOT NULL DEFAULT '' so existing rows backfill safely.

-- AlterTable
ALTER TABLE "Review" ADD COLUMN "role" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Review" ADD COLUMN "avatar" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN "email" TEXT NOT NULL DEFAULT '';
