/*
  Warnings:

  - You are about to drop the `ListingItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Lecture" ADD COLUMN     "campus" "Campus";

-- DropTable
DROP TABLE "ListingItem";

-- CreateTable
CREATE TABLE "listing_item" (
    "id" SERIAL NOT NULL,
    "document_id" TEXT NOT NULL,
    "purchased_at" TIMESTAMP(3),
    "purchased_user_id" TEXT,
    "condition" "Condition" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "department" "Academics" NOT NULL,
    "description" TEXT,
    "image_url" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "listing_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lecture_school_year_semester_weekday_period_campus_idx" ON "Lecture"("school_year", "semester", "weekday", "period", "campus");
