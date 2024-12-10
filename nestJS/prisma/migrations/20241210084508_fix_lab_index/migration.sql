-- DropIndex
DROP INDEX "Lab_academic_department_teacher_idx";

-- CreateIndex
CREATE INDEX "Lab_academic_department_idx" ON "Lab"("academic", "department");
