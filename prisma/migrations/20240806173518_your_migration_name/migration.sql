/*
  Warnings:

  - You are about to drop the column `titleId` on the `commentdislike` table. All the data in the column will be lost.
  - You are about to drop the column `titleId` on the `commentlike` table. All the data in the column will be lost.
  - Added the required column `commentTitleId` to the `commentDislike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commentTitleId` to the `commentLike` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `commentdislike` DROP FOREIGN KEY `commentDislike_titleId_fkey`;

-- DropForeignKey
ALTER TABLE `commentlike` DROP FOREIGN KEY `commentLike_titleId_fkey`;

-- AlterTable
ALTER TABLE `commentdislike` DROP COLUMN `titleId`,
    ADD COLUMN `commentTitleId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `commentlike` DROP COLUMN `titleId`,
    ADD COLUMN `commentTitleId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `commentLike` ADD CONSTRAINT `commentLike_commentTitleId_fkey` FOREIGN KEY (`commentTitleId`) REFERENCES `commentTitle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commentDislike` ADD CONSTRAINT `commentDislike_commentTitleId_fkey` FOREIGN KEY (`commentTitleId`) REFERENCES `commentTitle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
