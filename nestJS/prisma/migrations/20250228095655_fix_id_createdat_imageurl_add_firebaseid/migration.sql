/*
  Warnings:

  - You are about to drop the column `buildingId` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the `ListingItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_buildingId_fkey";

-- DropIndex
DROP INDEX "Lecture_school_year_semester_buildingId_idx";

-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "buildingId",
ADD COLUMN     "building" TEXT;

-- DropTable
DROP TABLE "ListingItem";

-- CreateTable
CREATE TABLE "listing_item" (
    "id" SERIAL NOT NULL,
    "document_id" TEXT NOT NULL,
    "purchased_at" TIMESTAMP(3),
    "purchased_user_id" TEXT,
    "condition" "Condition" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "department" "Academics" NOT NULL,
    "description" TEXT,
    "image_url" TEXT[],
    "price" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "firebase_user_id" TEXT NOT NULL,

    CONSTRAINT "listing_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listing_item_document_id_key" ON "listing_item"("document_id");
