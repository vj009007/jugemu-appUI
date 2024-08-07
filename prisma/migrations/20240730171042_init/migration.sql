/*
  Warnings:

  - Changed the type of `status` on the `subscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StripeSubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED');

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "model_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "status",
ADD COLUMN     "status" "StripeSubscriptionStatus" NOT NULL,
ALTER COLUMN "start_date" SET DEFAULT CURRENT_TIMESTAMP;
