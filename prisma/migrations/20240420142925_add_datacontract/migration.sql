/*
  Warnings:

  - You are about to drop the `Agreement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerRelationship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agreement" DROP CONSTRAINT "Agreement_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Agreement" DROP CONSTRAINT "Agreement_uploaderId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerRelationship" DROP CONSTRAINT "CustomerRelationship_buyerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerRelationship" DROP CONSTRAINT "CustomerRelationship_sellerOrgId_fkey";

-- AlterTable
ALTER TABLE "MarketDataSource" ADD COLUMN     "allowDownload" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Agreement";

-- DropTable
DROP TABLE "CustomerRelationship";

-- CreateTable
CREATE TABLE "DataAgreement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "file" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uploaderId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "DataAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataContract" (
    "id" TEXT NOT NULL,
    "marketDataSourceId" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "buyerOrgId" TEXT NOT NULL,
    "sellerOrgId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "allowDownload" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataContract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DataAgreement_organizationId_idx" ON "DataAgreement"("organizationId");

-- AddForeignKey
ALTER TABLE "DataAgreement" ADD CONSTRAINT "DataAgreement_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAgreement" ADD CONSTRAINT "DataAgreement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataContract" ADD CONSTRAINT "DataContract_marketDataSourceId_fkey" FOREIGN KEY ("marketDataSourceId") REFERENCES "MarketDataSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataContract" ADD CONSTRAINT "DataContract_buyerOrgId_fkey" FOREIGN KEY ("buyerOrgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataContract" ADD CONSTRAINT "DataContract_sellerOrgId_fkey" FOREIGN KEY ("sellerOrgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataContract" ADD CONSTRAINT "DataContract_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "DataAgreement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
