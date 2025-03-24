/*
  Warnings:

  - The values [All,LiberalArts] on the enum `Academics` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('All', 'LiberalArts', 'FurnitureAndHomeAppliances', 'Law', 'SocialSciences', 'InternationalRelations', 'Literature', 'Business', 'PolicyScience', 'Psychology', 'GlobalLiberalArts', 'Film', 'InformationScience', 'ScienceAndTechnology', 'Economics', 'SportsHealthScience', 'FoodManagement', 'LifeSciences', 'Pharmacy');

-- AlterEnum
BEGIN;
CREATE TYPE "Academics_new" AS ENUM ('Law', 'SocialSciences', 'InternationalRelations', 'Literature', 'Business', 'PolicyScience', 'Psychology', 'GlobalLiberalArts', 'Film', 'InformationScience', 'ScienceAndTechnology', 'Economics', 'SportsHealthScience', 'FoodManagement', 'LifeSciences', 'Pharmacy');
ALTER TABLE "Lecture" ALTER COLUMN "academic" TYPE "Academics_new" USING ("academic"::text::"Academics_new");
ALTER TABLE "Lab" ALTER COLUMN "academic" TYPE "Academics_new" USING ("academic"::text::"Academics_new");
ALTER TABLE "listing_item" ALTER COLUMN "department" TYPE "Academics_new" USING ("department"::text::"Academics_new");
ALTER TYPE "Academics" RENAME TO "Academics_old";
ALTER TYPE "Academics_new" RENAME TO "Academics";
DROP TYPE "Academics_old";
COMMIT;
