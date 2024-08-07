/*
  Warnings:

  - Made the column `displayName` on table `models` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "models" ALTER COLUMN "displayName" SET NOT NULL;
