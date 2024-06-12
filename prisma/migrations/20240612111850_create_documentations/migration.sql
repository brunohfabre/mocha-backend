-- CreateTable
CREATE TABLE "documentations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "documentations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "documentations" ADD CONSTRAINT "documentations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
