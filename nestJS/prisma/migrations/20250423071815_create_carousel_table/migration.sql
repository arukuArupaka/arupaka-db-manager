-- CreateTable
CREATE TABLE "Carousel" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,

    CONSTRAINT "Carousel_pkey" PRIMARY KEY ("id")
);
