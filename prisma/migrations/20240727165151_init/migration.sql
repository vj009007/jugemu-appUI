/*
  Warnings:

  - You are about to drop the column `uuid` on the `chats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hash]` on the table `chats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "chats_uuid_key";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "uuid",
ADD COLUMN     "hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "chats_hash_key" ON "chats"("hash");
