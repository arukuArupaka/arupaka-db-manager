-- CreateTable
CREATE TABLE "DeviceToken" (
    "id" SERIAL NOT NULL,
    "device_token" TEXT NOT NULL,
    "firebase_user_id" TEXT,

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceToken_device_token_key" ON "DeviceToken"("device_token");
