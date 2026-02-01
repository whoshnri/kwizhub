-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "department" TEXT,
ADD COLUMN     "level" TEXT;

-- CreateIndex
CREATE INDEX "Material_department_idx" ON "Material"("department");

-- CreateIndex
CREATE INDEX "Material_level_idx" ON "Material"("level");
