/*
  Warnings:

  - Made the column `environments` on table `collections` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "environments" SET NOT NULL;
