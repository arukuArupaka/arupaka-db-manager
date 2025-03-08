/*
  Warnings:

  - You are about to drop the column `classRoom` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `school_year` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `week_day` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `building` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `classroom` on the `Lecture` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Building` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[academic,school_year,semester,name]` on the table `Lecture` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Building" DROP COLUMN "classRoom",
DROP COLUMN "period",
DROP COLUMN "school_year",
DROP COLUMN "semester",
DROP COLUMN "week_day";

-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "building",
DROP COLUMN "classroom",
ADD COLUMN     "raw_classrom" TEXT;

-- CreateTable
CREATE TABLE "LectureClassroom" (
    "id" SERIAL NOT NULL,
    "lecture_id" INTEGER NOT NULL,
    "classroom_id" INTEGER NOT NULL,

    CONSTRAINT "LectureClassroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" SERIAL NOT NULL,
    "building_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LectureClassroom_lecture_id_classroom_id_idx" ON "LectureClassroom"("lecture_id", "classroom_id");

-- CreateIndex
CREATE UNIQUE INDEX "LectureClassroom_lecture_id_classroom_id_key" ON "LectureClassroom"("lecture_id", "classroom_id");

-- CreateIndex
CREATE INDEX "Classroom_building_id_name_idx" ON "Classroom"("building_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_building_id_name_key" ON "Classroom"("building_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Building_name_key" ON "Building"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Lecture_academic_school_year_semester_name_key" ON "Lecture"("academic", "school_year", "semester", "name");

-- AddForeignKey
ALTER TABLE "LectureClassroom" ADD CONSTRAINT "LectureClassroom_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureClassroom" ADD CONSTRAINT "LectureClassroom_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "Building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
