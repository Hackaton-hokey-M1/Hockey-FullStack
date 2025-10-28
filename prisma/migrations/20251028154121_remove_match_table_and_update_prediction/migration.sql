-- DropForeignKey
ALTER TABLE "Prediction" DROP CONSTRAINT "Prediction_matchId_fkey";

-- DropIndex
DROP INDEX "Prediction_groupId_matchId_idx";

-- DropIndex
DROP INDEX "Prediction_userId_groupId_matchId_key";

-- DropTable
DROP TABLE "Match";

-- DropEnum
DROP TYPE "MatchStatus";

-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "matchId",
ADD COLUMN "externalMatchId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Prediction_groupId_externalMatchId_idx" ON "Prediction"("groupId", "externalMatchId");

-- CreateIndex
CREATE INDEX "Prediction_externalMatchId_idx" ON "Prediction"("externalMatchId");

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_userId_groupId_externalMatchId_key" ON "Prediction"("userId", "groupId", "externalMatchId");

