/*
  Warnings:

  - Added the required column `tolerance_x` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tolerance_y` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "tolerance_x" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tolerance_y" DOUBLE PRECISION NOT NULL;
