-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_collection_id_fkey";

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
