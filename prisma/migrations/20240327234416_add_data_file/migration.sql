-- AlterTable
ALTER TABLE "User" ADD COLUMN     "apiToken" TEXT;

-- CreateTable
CREATE TABLE "DataFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DataFile" ADD CONSTRAINT "DataFile_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFile" ADD CONSTRAINT "DataFile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
