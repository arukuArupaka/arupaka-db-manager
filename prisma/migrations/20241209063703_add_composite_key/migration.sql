/*
  Warnings:

  - You are about to drop the column `academics` on the `Lab` table. All the data in the column will be lost.
  - You are about to drop the column `academics` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the `LabFeedback` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[class_code,academic,name]` on the table `Lecture` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academic` to the `Lab` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academic` to the `Lecture` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Academics" AS ENUM ('Law', 'SocialSciences', 'InternationalRelations', 'Letters', 'Economics', 'SportandHealthScience', 'ScienceandEngineering', 'LifeSciences', 'PharmaceuticalSciences', 'GastronomyManagement', 'BusinessAdministration', 'PolicyScience', 'ComprehensivePsychology', 'GlobalLiberalArts', 'ImageArtsandSciences', 'InformationScienceandEngineering');

-- DropForeignKey
ALTER TABLE "LabFeedback" DROP CONSTRAINT "LabFeedback_lab_id_fkey";

-- AlterTable
ALTER TABLE "Lab" DROP COLUMN "academics",
ADD COLUMN     "academic" "Academics" NOT NULL;

-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "academics",
ADD COLUMN     "academic" "Academics" NOT NULL;

-- DropTable
DROP TABLE "LabFeedback";

-- DropEnum
DROP TYPE "Academic";

-- CreateTable
CREATE TABLE "lab_feedback" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,
    "attendance" INTEGER NOT NULL,
    "ease" INTEGER NOT NULL,
    "satisfaction" INTEGER NOT NULL,
    "lab_id" INTEGER NOT NULL,

    CONSTRAINT "lab_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Building" (
    "id" SERIAL NOT NULL,
    "campus" "Campus" NOT NULL,
    "name" TEXT NOT NULL,
    "classRoom" TEXT[],
    "school_year" INTEGER NOT NULL,
    "semester" BOOLEAN NOT NULL,
    "week_day" TEXT NOT NULL,
    "period" INTEGER NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lab_academic_department_teacher_idx" ON "Lab"("academic", "department", "teacher");

-- CreateIndex
CREATE INDEX "Lecture_school_year_semester_weekday_period_academic_idx" ON "Lecture"("school_year", "semester", "weekday", "period", "academic");

-- CreateIndex
CREATE INDEX "Lecture_name_teacher_idx" ON "Lecture"("name", "teacher");

-- CreateIndex
CREATE UNIQUE INDEX "Lecture_class_code_academic_name_key" ON "Lecture"("class_code", "academic", "name");

-- AddForeignKey
ALTER TABLE "lab_feedback" ADD CONSTRAINT "lab_feedback_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "Lab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
