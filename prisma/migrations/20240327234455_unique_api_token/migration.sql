/*
  Warnings:

  - A unique constraint covering the columns `[apiToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_apiToken_key" ON "User"("apiToken");
