-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "category" TEXT;

-- CreateIndex
CREATE INDEX "Material_category_idx" ON "Material"("category");
