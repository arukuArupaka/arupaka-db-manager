/*
  Warnings:

  - A unique constraint covering the columns `[document_id]` on the table `listing_item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebase_user_id` to the `listing_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "listing_item" ADD COLUMN     "firebase_user_id" TEXT NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "listing_item_document_id_key" ON "listing_item"("document_id");
