/*
  Warnings:

  - You are about to drop the column `collectionId` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `requests` table. All the data in the column will be lost.
  - Added the required column `collection_id` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_collectionId_fkey";

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "collectionId",
DROP COLUMN "parentId",
ADD COLUMN     "collection_id" TEXT NOT NULL,
ADD COLUMN     "parent_id" TEXT,
ALTER COLUMN "method" SET DEFAULT 'GET';

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
