/*
  Warnings:

  - Made the column `hash` on table `chats` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "chats" ALTER COLUMN "hash" SET NOT NULL;
