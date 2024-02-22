/*
  Warnings:

  - A unique constraint covering the columns `[emailDomain]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Organization_emailDomain_key" ON "Organization"("emailDomain");
