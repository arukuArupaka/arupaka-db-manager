-- CreateTable
CREATE TABLE "Carousel" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "public_id" TEXT NOT NULL,

    CONSTRAINT "Carousel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Carousel_public_id_key" ON "Carousel"("public_id");
