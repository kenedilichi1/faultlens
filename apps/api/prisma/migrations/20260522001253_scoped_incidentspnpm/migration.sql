/*
  Warnings:

  - Added the required column `organizationId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "requestId" TEXT;
