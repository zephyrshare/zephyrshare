-- DropForeignKey
ALTER TABLE "DataContract" DROP CONSTRAINT "DataContract_latestStatusId_fkey";

-- AlterTable
ALTER TABLE "DataContract" ALTER COLUMN "latestStatusId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DataContract" ADD CONSTRAINT "DataContract_latestStatusId_fkey" FOREIGN KEY ("latestStatusId") REFERENCES "DataContractStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
