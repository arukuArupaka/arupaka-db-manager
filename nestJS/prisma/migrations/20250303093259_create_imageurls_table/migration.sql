/*
  Warnings:

  - The values [Letters,SportandHealthScience,ScienceandEngineering,PharmaceuticalSciences,GastronomyManagement,BusinessAdministration,ComprehensivePsychology,ImageArtsandSciences,InformationScienceandEngineering] on the enum `Academics` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `image_url` on the `listing_item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document_id]` on the table `listing_item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebase_user_id` to the `listing_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Academics_new" AS ENUM ('All', 'LiberalArts', 'Law', 'SocialSciences', 'InternationalRelations', 'Literature', 'Business', 'PolicyScience', 'Psychology', 'GlobalLiberalArts', 'Film', 'InformationScience', 'ScienceAndTechnology', 'Economics', 'SportsHealthScience', 'FoodManagement', 'LifeSciences', 'Pharmacy');
ALTER TABLE "Lecture" ALTER COLUMN "academic" TYPE "Academics_new" USING ("academic"::text::"Academics_new");
ALTER TABLE "Lab" ALTER COLUMN "academic" TYPE "Academics_new" USING ("academic"::text::"Academics_new");
ALTER TABLE "listing_item" ALTER COLUMN "department" TYPE "Academics_new" USING ("department"::text::"Academics_new");
ALTER TYPE "Academics" RENAME TO "Academics_old";
ALTER TYPE "Academics_new" RENAME TO "Academics";
DROP TYPE "Academics_old";
COMMIT;

-- AlterTable
ALTER TABLE "listing_item" DROP COLUMN "image_url",
ADD COLUMN     "firebase_user_id" TEXT NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "image_url" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "listing_item_id" INTEGER NOT NULL,

    CONSTRAINT "image_url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listing_item_document_id_key" ON "listing_item"("document_id");

-- AddForeignKey
ALTER TABLE "image_url" ADD CONSTRAINT "image_url_listing_item_id_fkey" FOREIGN KEY ("listing_item_id") REFERENCES "listing_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
