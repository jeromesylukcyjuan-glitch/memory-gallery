-- Memory Gallery 数据库迁移脚本
-- 这个脚本创建所有必需的表来支持Memory Gallery应用

-- 创建相册表
CREATE TABLE IF NOT EXISTS `albums` (
    `id` int AUTO_INCREMENT NOT NULL,
    `userId` int NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text,
    `coverImageUrl` text,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_userId` (`userId`)
);

-- 创建回忆表
CREATE TABLE IF NOT EXISTS `memories` (
    `id` int AUTO_INCREMENT NOT NULL,
    `userId` int NOT NULL,
    `albumId` int,
    `title` varchar(255),
    `description` text,
    `fileUrl` text NOT NULL,
    `fileKey` text NOT NULL,
    `fileType` varchar(50) NOT NULL,
    `mimeType` varchar(100),
    `memoryDate` timestamp NOT NULL,
    `aiGenerated` enum('pending','completed','failed') DEFAULT 'pending',
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_userId` (`userId`),
    INDEX `idx_albumId` (`albumId`),
    INDEX `idx_memoryDate` (`memoryDate`),
    FOREIGN KEY (`albumId`) REFERENCES `albums`(`id`) ON DELETE CASCADE
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS `tags` (
    `id` int AUTO_INCREMENT NOT NULL,
    `memoryId` int NOT NULL,
    `tag` varchar(100) NOT NULL,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_memoryId` (`memoryId`),
    INDEX `idx_tag` (`tag`),
    FOREIGN KEY (`memoryId`) REFERENCES `memories`(`id`) ON DELETE CASCADE
);

-- 完成！现在您可以使用Memory Gallery应用了
