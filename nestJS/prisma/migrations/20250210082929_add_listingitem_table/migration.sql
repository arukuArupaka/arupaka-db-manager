-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('BRAND_NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR', 'BAD');

-- CreateTable
CREATE TABLE "ListingItem" (
    "id" SERIAL NOT NULL,
    "purchased_at" TIMESTAMP(3),
    "purchased_user_id" TEXT,
    "condition" "Condition" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "department" "Academics" NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ListingItem_pkey" PRIMARY KEY ("id")
);
