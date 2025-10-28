-- AlterTable
ALTER TABLE "Group" ADD COLUMN "matchId" INTEGER;

-- CreateIndex
CREATE INDEX "Group_matchId_idx" ON "Group"("matchId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

