-- CreateEnum
CREATE TYPE "Campus" AS ENUM ('KIC', 'BKC', 'OIC');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('Monday', 'Tuseday', 'Wednsday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "Academic" AS ENUM ('Law', 'SocialSciences', 'InternationalRelations', 'Letters', 'Economics', 'SportandHealthScience', 'ScienceandEngineering', 'LifeSciences', 'PharmaceuticalSciences', 'GastronomyManagement', 'BusinessAdministration', 'PolicyScience', 'ComprehensivePsychology', 'GlobalLiberalArts', 'ImageArtsandSciences', 'InformationScienceandEngineering');

-- CreateTable
CREATE TABLE "Lecture" (
    "id" SERIAL NOT NULL,
    "class_code" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT,
    "field" TEXT,
    "syllabus" TEXT,
    "teacher" TEXT NOT NULL,
    "academics" "Academic" NOT NULL,
    "building" TEXT,
    "classroom" TEXT,
    "school_year" INTEGER NOT NULL,
    "semester" BOOLEAN NOT NULL,
    "weekday" "Weekday" NOT NULL,
    "period" INTEGER NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lab" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "place" TEXT,
    "campus" "Campus" NOT NULL,
    "academics" "Academic" NOT NULL,
    "department" INTEGER NOT NULL,
    "teacher" TEXT NOT NULL,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,
    "attendance" INTEGER NOT NULL,
    "ease" INTEGER NOT NULL,
    "satisfaction" INTEGER NOT NULL,
    "lecture_id" INTEGER NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassMatching" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "ClassMatching_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "stack_screen" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabFeedback" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,
    "attendance" INTEGER NOT NULL,
    "ease" INTEGER NOT NULL,
    "satisfaction" INTEGER NOT NULL,
    "lab_id" INTEGER NOT NULL,

    CONSTRAINT "LabFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabFeedback" ADD CONSTRAINT "LabFeedback_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "Lab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
