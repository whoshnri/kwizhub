/*
  Warnings:

  - Added the required column `semester` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "semester" "Semester" NOT NULL;
