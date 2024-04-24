/*
  Warnings:

  - You are about to drop the column `agreementId` on the `DataContract` table. All the data in the column will be lost.
  - You are about to drop the `DataAgreement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DataAgreement" DROP CONSTRAINT "DataAgreement_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "DataAgreement" DROP CONSTRAINT "DataAgreement_uploaderId_fkey";

-- DropForeignKey
ALTER TABLE "DataContract" DROP CONSTRAINT "DataContract_agreementId_fkey";

-- AlterTable
ALTER TABLE "DataContract" DROP COLUMN "agreementId";

-- DropTable
DROP TABLE "DataAgreement";
