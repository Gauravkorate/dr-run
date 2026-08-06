/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
ALTER TABLE "Hospital"
ADD COLUMN "code" TEXT;

UPDATE "Hospital"
SET "code" = 'DRRUN-DEMO'
WHERE "code" IS NULL;

ALTER TABLE "Hospital"
ALTER COLUMN "code" SET NOT NULL;

CREATE UNIQUE INDEX "Hospital_code_key"
ON "Hospital"("code");