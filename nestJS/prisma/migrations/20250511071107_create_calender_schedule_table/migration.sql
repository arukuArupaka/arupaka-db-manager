-- CreateTable
CREATE TABLE "CalenderSchedule" (
    "id" SERIAL NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "minute" INTEGER,
    "hour" INTEGER,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "weekday" "Weekday",
    "title" TEXT NOT NULL,
    "description" TEXT,
    "message" TEXT,
    "tag" TEXT,

    CONSTRAINT "CalenderSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalenderSchedule_schedule_id_key" ON "CalenderSchedule"("schedule_id");
