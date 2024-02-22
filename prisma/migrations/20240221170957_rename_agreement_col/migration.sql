/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Agreement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agreement" DROP CONSTRAINT "Agreement_ownerId_fkey";

-- DropIndex
DROP INDEX "Agreement_ownerId_idx";

-- AlterTable
ALTER TABLE "Agreement" DROP COLUMN "ownerId",
ADD COLUMN     "uploaderId" TEXT;

-- CreateIndex
CREATE INDEX "Agreement_organizationId_idx" ON "Agreement"("organizationId");

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
