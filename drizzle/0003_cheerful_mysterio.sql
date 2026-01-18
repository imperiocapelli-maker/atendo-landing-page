CREATE TABLE `calendlyWebhooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`payload` text NOT NULL,
	`inviteeName` varchar(255) NOT NULL,
	`inviteeEmail` varchar(320) NOT NULL,
	`inviteePhone` varchar(20) NOT NULL,
	`scheduledAt` timestamp NOT NULL,
	`notificationSent` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`notificationError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `calendlyWebhooks_id` PRIMARY KEY(`id`)
);
