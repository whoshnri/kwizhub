-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "bunnyCdnUrl" TEXT;

-- CreateTable
CREATE TABLE "AppSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionTokenHash" TEXT NOT NULL,
    "deviceId" TEXT,
    "deviceName" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "AppSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppSession_sessionTokenHash_key" ON "AppSession"("sessionTokenHash");

-- CreateIndex
CREATE INDEX "AppSession_userId_idx" ON "AppSession"("userId");

-- CreateIndex
CREATE INDEX "Material_adminId_isPublished_idx" ON "Material"("adminId", "isPublished");

-- CreateIndex
CREATE INDEX "Material_courseCode_idx" ON "Material"("courseCode");

-- CreateIndex
CREATE INDEX "Material_semester_idx" ON "Material"("semester");

-- CreateIndex
CREATE INDEX "Transaction_adminId_createdAt_idx" ON "Transaction"("adminId", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_materialId_idx" ON "Transaction"("materialId");

-- CreateIndex
CREATE INDEX "Transaction_type_createdAt_idx" ON "Transaction"("type", "createdAt");

-- AddForeignKey
ALTER TABLE "AppSession" ADD CONSTRAINT "AppSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
