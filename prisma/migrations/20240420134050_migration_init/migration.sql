/*
  Warnings:

  - Made the column `formId` on table `Status` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Status" DROP CONSTRAINT "Status_formId_fkey";

-- AlterTable
ALTER TABLE "Status" ALTER COLUMN "formId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
