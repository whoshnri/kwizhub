/*
  Warnings:

  - You are about to drop the column `departments` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `levels` on the `Material` table. All the data in the column will be lost.
  - Added the required column `courseCode` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('FIRST', 'SECOND');

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "departments",
DROP COLUMN "levels",
ADD COLUMN     "courseCode" TEXT NOT NULL;
