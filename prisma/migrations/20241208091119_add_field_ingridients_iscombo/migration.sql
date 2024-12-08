/*
  Warnings:

  - Added the required column `isCombo` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "ingridientsAZ" TEXT[],
ADD COLUMN     "ingridientsEN" TEXT[],
ADD COLUMN     "isCombo" BOOLEAN NOT NULL;
