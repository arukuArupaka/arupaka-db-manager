/*
  Warnings:

  - You are about to drop the column `buildingId` on the `Lecture` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_buildingId_fkey";

-- DropIndex
DROP INDEX "Lecture_school_year_semester_buildingId_idx";

-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "buildingId",
ADD COLUMN     "building" TEXT;

-- CreateIndex
CREATE INDEX "Lecture_school_year_semester_weekday_period_building_idx" ON "Lecture"("school_year", "semester", "weekday", "period", "building");
