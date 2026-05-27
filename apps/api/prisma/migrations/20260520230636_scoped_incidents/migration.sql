/*
  Warnings:

  - A unique constraint covering the columns `[fingerprint,projectId]` on the table `Incident` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Incident_fingerprint_key";

-- CreateIndex
CREATE UNIQUE INDEX "Incident_fingerprint_projectId_key" ON "Incident"("fingerprint", "projectId");
