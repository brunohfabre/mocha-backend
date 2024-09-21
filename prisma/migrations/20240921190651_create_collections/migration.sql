/*
  Warnings:

  - You are about to drop the column `organization_id` on the `requests` table. All the data in the column will be lost.
  - Added the required column `collectionId` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_organization_id_fkey";

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "organization_id",
ADD COLUMN     "collectionId" TEXT NOT NULL,
ADD COLUMN     "parentId" TEXT;

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
