-- AlterTable
ALTER TABLE "Agreement" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "emailDomain" TEXT;
