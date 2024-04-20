/*
  Warnings:

  - You are about to drop the column `allowDownload` on the `MarketDataSource` table. All the data in the column will be lost.
  - Added the required column `contractAmount` to the `DataContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataContract" ADD COLUMN     "contractAmount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "MarketDataSource" DROP COLUMN "allowDownload";
