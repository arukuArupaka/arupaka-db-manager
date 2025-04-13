-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "minute" INTEGER NOT NULL,
    "hour" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);
