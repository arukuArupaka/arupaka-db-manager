-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "execute_time" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);
