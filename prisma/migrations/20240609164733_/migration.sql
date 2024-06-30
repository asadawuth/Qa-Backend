/*
  Warnings:

  - You are about to drop the `user_profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_profile` DROP FOREIGN KEY `User_Profile_userId_fkey`;

-- AlterTable
ALTER TABLE `title` ADD COLUMN `poststory` VARCHAR(191) NULL,
    ADD COLUMN `poststoryImage` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `user_profile`;

-- CreateTable
CREATE TABLE `User_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `nickName` VARCHAR(191) NULL,
    `tel` VARCHAR(191) NULL,
    `age` VARCHAR(191) NULL,
    `sex` VARCHAR(191) NULL,
    `nationality` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `pinMapGps` VARCHAR(191) NULL,

    UNIQUE INDEX `User_data_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User_data` ADD CONSTRAINT `User_data_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
