-- CreateEnum
CREATE TYPE "AnomalyStatus" AS ENUM ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED');

-- AlterTable
ALTER TABLE "Anomaly" ADD COLUMN     "acknowledgedAt" TIMESTAMP(3),
ADD COLUMN     "acknowledgedById" TEXT,
ADD COLUMN     "resolvedById" TEXT,
ADD COLUMN     "status" "AnomalyStatus" NOT NULL DEFAULT 'ACTIVE';
