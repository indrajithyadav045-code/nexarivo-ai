CREATE TABLE `usageEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`model` varchar(64) NOT NULL,
	`requestCount` int NOT NULL DEFAULT 1,
	`inputTokens` int NOT NULL DEFAULT 0,
	`outputTokens` int NOT NULL DEFAULT 0,
	`latencyMs` int NOT NULL DEFAULT 0,
	`status` enum('success','error') NOT NULL DEFAULT 'success',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `usageEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `usageEvents` ADD CONSTRAINT `usageEvents_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;