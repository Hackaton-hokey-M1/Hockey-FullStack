-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_matchId_fkey";

-- DropIndex
DROP INDEX "Group_matchId_idx";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "matchId",
ADD COLUMN "externalMatchId" TEXT;

-- CreateIndex
CREATE INDEX "Group_externalMatchId_idx" ON "Group"("externalMatchId");

