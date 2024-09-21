-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('REQUEST', 'FOLDER');

-- CreateEnum
CREATE TYPE "Method" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RequestType" NOT NULL,
    "url" TEXT,
    "method" "Method",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
