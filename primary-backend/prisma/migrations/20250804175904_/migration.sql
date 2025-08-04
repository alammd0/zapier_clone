/*
  Warnings:

  - A unique constraint covering the columns `[zapId,sortingOrder]` on the table `Action` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_zapId_fkey";

-- AlterTable
ALTER TABLE "Action" ALTER COLUMN "metadata" DROP NOT NULL,
ALTER COLUMN "sortingOrder" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ZapRun" ALTER COLUMN "metaData" SET DEFAULT '{}';

-- CreateIndex
CREATE UNIQUE INDEX "Action_zapId_sortingOrder_key" ON "Action"("zapId", "sortingOrder");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
