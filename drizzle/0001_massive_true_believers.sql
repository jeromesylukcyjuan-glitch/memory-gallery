CREATE TABLE `albums` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`coverImageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `albums_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memories` (
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
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `memories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memoryId` int NOT NULL,
	`tag` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`)
);
