/*
  Warnings:

  - You are about to drop the column `department` on the `listing_item` table. All the data in the column will be lost.
  - Added the required column `category` to the `listing_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "listing_item" DROP COLUMN "department",
ADD COLUMN     "category" "ItemCategory" NOT NULL;
