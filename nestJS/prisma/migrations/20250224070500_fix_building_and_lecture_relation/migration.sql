/*
  Warnings:

  - You are about to drop the column `building` on the `Lecture` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "building",
ADD COLUMN     "buildingId" INTEGER;

-- CreateIndex
CREATE INDEX "Lecture_school_year_semester_buildingId_idx" ON "Lecture"("school_year", "semester", "buildingId");

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE SET NULL ON UPDATE CASCADE;
