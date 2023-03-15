/*
 Warnings:
 - You are about to drop the column `childId` on the `Goal` table. All the data in the column will be lost.
 */

-- DropForeignKey

ALTER TABLE "Goal" DROP CONSTRAINT "Goal_childId_fkey";

-- AlterTable

ALTER TABLE
    "Goal" DROP COLUMN "childId",
ADD COLUMN "parentId" INTEGER;

-- AddForeignKey

ALTER TABLE "Goal"
ADD
    CONSTRAINT "Goal_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Goal"("id") ON DELETE
SET NULL ON UPDATE CASCADE;