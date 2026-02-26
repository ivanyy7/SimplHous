-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN "is_favorite" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Prompt_user_id_is_favorite_idx" ON "Prompt"("user_id", "is_favorite");
