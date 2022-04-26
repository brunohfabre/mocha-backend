-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_toId_fkey";

-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false;
