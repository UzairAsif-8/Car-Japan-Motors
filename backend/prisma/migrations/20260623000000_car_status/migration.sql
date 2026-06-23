-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('AVAILABLE', 'SOLD', 'UPCOMING');

-- AlterTable
ALTER TABLE "Car" ADD COLUMN "status" "CarStatus" NOT NULL DEFAULT 'AVAILABLE';

-- Migrate existing rows: isSold=true → SOLD, otherwise AVAILABLE
UPDATE "Car" SET "status" = 'SOLD' WHERE "isSold" = true;

-- DropIndex
DROP INDEX IF EXISTS "Car_isSold_idx";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "isSold";

-- CreateIndex
CREATE INDEX "Car_status_idx" ON "Car"("status");
