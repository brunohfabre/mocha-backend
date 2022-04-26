-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_projectId_fkey";

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
