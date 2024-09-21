/*
  Warnings:

  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_organizationId_fkey";

-- DropTable
DROP TABLE "Request";

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RequestType" NOT NULL,
    "url" TEXT,
    "method" "Method",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
