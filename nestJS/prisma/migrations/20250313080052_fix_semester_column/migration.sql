/*
  Warnings:

  - Changed the type of `semester` on the `Lecture` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('Spring', 'Autumn');

-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "semester",
ADD COLUMN     "semester" "Semester" NOT NULL;

-- CreateIndex
CREATE INDEX "Lecture_academic_school_year_semester_class_code_weekday_pe_idx" ON "Lecture"("academic", "school_year", "semester", "class_code", "weekday", "period");

-- CreateIndex
CREATE INDEX "Lecture_school_year_semester_weekday_period_academic_idx" ON "Lecture"("school_year", "semester", "weekday", "period", "academic");

-- CreateIndex
CREATE INDEX "Lecture_school_year_semester_weekday_period_campus_idx" ON "Lecture"("school_year", "semester", "weekday", "period", "campus");

-- CreateIndex
CREATE UNIQUE INDEX "Lecture_academic_school_year_semester_class_code_weekday_pe_key" ON "Lecture"("academic", "school_year", "semester", "class_code", "weekday", "period");
