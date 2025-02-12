/*
  Warnings:

  - Added the required column `updated_at` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "should_attach_users_by_domain" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
