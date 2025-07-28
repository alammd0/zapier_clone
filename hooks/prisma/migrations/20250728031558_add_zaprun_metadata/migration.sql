/*
  Warnings:

  - Added the required column `metaData` to the `ZapRun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ZapRun" ADD COLUMN     "metaData" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "ZapRunOutBox" (
    "id" TEXT NOT NULL,
    "zapRunId" TEXT NOT NULL,

    CONSTRAINT "ZapRunOutBox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZapRunOutBox_zapRunId_key" ON "ZapRunOutBox"("zapRunId");

-- AddForeignKey
ALTER TABLE "ZapRunOutBox" ADD CONSTRAINT "ZapRunOutBox_zapRunId_fkey" FOREIGN KEY ("zapRunId") REFERENCES "ZapRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
