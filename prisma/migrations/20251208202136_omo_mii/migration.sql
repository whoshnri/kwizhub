/*
  Warnings:

  - You are about to drop the column `coauthor` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `referralLink` on the `Material` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SALE', 'WITHDRAWAL', 'REFERRAL_COMMISSION', 'EQUITY_PAYMENT');

-- DropIndex
DROP INDEX "Material_referralLink_key";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "coauthor",
DROP COLUMN "referralLink",
ADD COLUMN     "coAuthorAccepted" BOOLEAN,
ADD COLUMN     "coAuthorId" TEXT,
ADD COLUMN     "equityPercentage" DOUBLE PRECISION,
ADD COLUMN     "referralPercentage" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "earningsPercentage" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "materialId" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" TEXT NOT NULL,
    "materialId" TEXT,
    "orderId" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_code_key" ON "ReferralCode"("code");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_coAuthorId_fkey" FOREIGN KEY ("coAuthorId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
