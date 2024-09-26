/*
  Warnings:

  - Added the required column `auth` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auth_type` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('NONE', 'JSON');

-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('NONE', 'BEARER');

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "auth" JSONB NOT NULL,
ADD COLUMN     "auth_type" "AuthType" NOT NULL,
ADD COLUMN     "body" JSONB NOT NULL,
ADD COLUMN     "body_type" "BodyType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "headers" JSONB[],
ADD COLUMN     "params" JSONB[],
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
