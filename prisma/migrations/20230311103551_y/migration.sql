/*
  Warnings:

  - You are about to drop the column `dailyId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the `Daily` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyPerformance` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Interval" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR');

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_dailyId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "dailyId",
ADD COLUMN     "goalId" INTEGER,
ADD COLUMN     "max_grade" INTEGER NOT NULL DEFAULT 3;

-- DropTable
DROP TABLE "Daily";

-- DropTable
DROP TABLE "DailyPerformance";

-- CreateTable
CREATE TABLE "Goal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "importance" INTEGER NOT NULL DEFAULT 1,
    "periodicity" "Interval" NOT NULL DEFAULT 'DAY',
    "childId" INTEGER,
    "labelId" INTEGER,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Performance" (
    "id" SERIAL NOT NULL,
    "activitiesCount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reward" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "previousDayStreak" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Performance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE SET NULL ON UPDATE CASCADE;
