/*
  Warnings:

  - You are about to drop the column `userAId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `userBId` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `contactId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_userAId_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "userAId",
DROP COLUMN "userBId",
ADD COLUMN     "contactId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
