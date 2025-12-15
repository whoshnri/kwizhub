/*
  Warnings:

  - You are about to drop the column `department` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Material` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Material" DROP COLUMN "department",
DROP COLUMN "level",
ADD COLUMN     "departments" TEXT[],
ADD COLUMN     "levels" TEXT[];
