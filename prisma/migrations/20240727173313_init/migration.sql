/*
  Warnings:

  - You are about to drop the column `language_model_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `chat_language_models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `language_models` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chat_language_models" DROP CONSTRAINT "chat_language_models_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_language_models" DROP CONSTRAINT "chat_language_models_language_model_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_language_model_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "language_model_id",
ADD COLUMN     "model_id" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "chat_language_models";

-- DropTable
DROP TABLE "language_models";

-- CreateTable
CREATE TABLE "models" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_models" (
    "chat_id" INTEGER NOT NULL,
    "model_id" INTEGER NOT NULL,

    CONSTRAINT "chat_models_pkey" PRIMARY KEY ("chat_id","model_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "models_name_key" ON "models"("name");

-- AddForeignKey
ALTER TABLE "chat_models" ADD CONSTRAINT "chat_models_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_models" ADD CONSTRAINT "chat_models_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
