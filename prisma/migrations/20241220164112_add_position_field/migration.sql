-- 1️⃣ Add the `position` column, but keep it **nullable** first
ALTER TABLE "Category" ADD COLUMN "position" INTEGER;

ALTER TABLE "Product" ADD COLUMN "position" INTEGER;

ALTER TABLE "SubCategory" ADD COLUMN "position" INTEGER;

-- 2️⃣ Populate the `position` column for `Category`
WITH numbered_rows AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS position
  FROM "Category"
)
UPDATE "Category"
SET position = numbered_rows.position
FROM numbered_rows
WHERE "Category".id = numbered_rows.id;

-- 3️⃣ Populate the `position` column for `Product`
WITH numbered_rows AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS position
  FROM "Product"
)
UPDATE "Product"
SET position = numbered_rows.position
FROM numbered_rows
WHERE "Product".id = numbered_rows.id;

-- 4️⃣ Populate the `position` column for `SubCategory`
WITH numbered_rows AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS position
  FROM "SubCategory"
)
UPDATE "SubCategory"
SET position = numbered_rows.position
FROM numbered_rows
WHERE "SubCategory".id = numbered_rows.id;

-- 5️⃣ Now that the `position` column is populated, make it **NOT NULL**
ALTER TABLE "Category" ALTER COLUMN "position" SET NOT NULL;

ALTER TABLE "Product" ALTER COLUMN "position" SET NOT NULL;

ALTER TABLE "SubCategory" ALTER COLUMN "position" SET NOT NULL;

-- 6️⃣ Create unique indexes for the position column
CREATE UNIQUE INDEX "Category_position_key" ON "Category"("position");

-- CREATE UNIQUE INDEX "Product_position_key" ON "Product"("position");

CREATE UNIQUE INDEX "SubCategory_position_key" ON "SubCategory"("position");
