/*
  Warnings:

  - Added the required column `backgroundImage` to the `Info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Info" ADD COLUMN     "backgroundImage" TEXT NOT NULL;