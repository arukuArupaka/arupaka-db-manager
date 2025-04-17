-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "minute" INTEGER,
    "hour" INTEGER,
    "weekday" "Weekday",
    "message" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "form_id" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circle_member" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "line_user_id" TEXT,
    "student_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "circle_member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_schedule_id_key" ON "Schedule"("schedule_id");
