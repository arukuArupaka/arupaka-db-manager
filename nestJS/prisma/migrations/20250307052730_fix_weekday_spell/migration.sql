/*
  Warnings:

  - The values [Tuseday,Wednsday] on the enum `Weekday` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Weekday_new" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
ALTER TABLE "Lecture" ALTER COLUMN "weekday" TYPE "Weekday_new" USING ("weekday"::text::"Weekday_new");
ALTER TYPE "Weekday" RENAME TO "Weekday_old";
ALTER TYPE "Weekday_new" RENAME TO "Weekday";
DROP TYPE "Weekday_old";
COMMIT;
