/*
  Warnings:

  - You are about to drop the `Prompt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_user_id_fkey";

-- DropIndex
DROP INDEX "News_ownerId_updatedAt_idx";

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "is_favorite" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Prompt";

-- CreateIndex
CREATE INDEX "News_ownerId_idx" ON "News"("ownerId");

-- CreateIndex
CREATE INDEX "News_ownerId_visibility_idx" ON "News"("ownerId", "visibility");

-- CreateIndex
CREATE INDEX "News_ownerId_is_favorite_idx" ON "News"("ownerId", "is_favorite");
