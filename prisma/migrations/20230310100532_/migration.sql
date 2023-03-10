/*
  Warnings:

  - You are about to drop the column `permanentTaskId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the `PermanentTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_permanentTaskId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "permanentTaskId",
ADD COLUMN     "dailyId" INTEGER,
ALTER COLUMN "priority" SET DEFAULT 1,
ALTER COLUMN "priority" DROP DEFAULT;
DROP SEQUENCE "activity_priority_seq";

-- DropTable
DROP TABLE "PermanentTask";

-- CreateTable
CREATE TABLE "Daily" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "for_review" BOOLEAN NOT NULL,
    "note" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Daily_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_dailyId_fkey" FOREIGN KEY ("dailyId") REFERENCES "Daily"("id") ON DELETE SET NULL ON UPDATE CASCADE;
