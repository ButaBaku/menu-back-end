/*
  Warnings:

  - A unique constraint covering the columns `[titleEN]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[titleAZ]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[titleEN]` on the table `SubCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[titleAZ]` on the table `SubCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_titleEN_key" ON "Category"("titleEN");

-- CreateIndex
CREATE UNIQUE INDEX "Category_titleAZ_key" ON "Category"("titleAZ");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_titleEN_key" ON "SubCategory"("titleEN");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_titleAZ_key" ON "SubCategory"("titleAZ");
