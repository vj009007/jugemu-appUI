/*
  Warnings:

  - A unique constraint covering the columns `[displayName]` on the table `models` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "models" ADD COLUMN     "displayName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "models_displayName_key" ON "models"("displayName");
