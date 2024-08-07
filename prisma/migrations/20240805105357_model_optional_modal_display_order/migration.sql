-- AlterTable
ALTER TABLE "models" ALTER COLUMN "modalDisplayOrder" DROP NOT NULL,
ALTER COLUMN "modalDisplayOrder" DROP DEFAULT,
ALTER COLUMN "provider" DROP DEFAULT;
