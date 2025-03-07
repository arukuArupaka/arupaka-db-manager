/*
  Warnings:

  - You are about to drop the column `classRoom` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `school_year` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `week_day` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `building` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `classroom` on the `Lecture` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Building" DROP COLUMN "classRoom",
DROP COLUMN "period",
DROP COLUMN "school_year",
DROP COLUMN "semester",
DROP COLUMN "week_day";

-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "building",
DROP COLUMN "classroom";

-- CreateTable
CREATE TABLE "ClassRoom" (
    "id" SERIAL NOT NULL,
    "building_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ClassRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureClassRoom" (
    "id" SERIAL NOT NULL,
    "lecture_id" INTEGER NOT NULL,
    "class_room_id" INTEGER NOT NULL,

    CONSTRAINT "LectureClassRoom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClassRoom" ADD CONSTRAINT "ClassRoom_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "Building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureClassRoom" ADD CONSTRAINT "LectureClassRoom_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureClassRoom" ADD CONSTRAINT "LectureClassRoom_class_room_id_fkey" FOREIGN KEY ("class_room_id") REFERENCES "ClassRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
