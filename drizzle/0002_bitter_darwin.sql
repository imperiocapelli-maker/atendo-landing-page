CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`formattedPhone` varchar(30) NOT NULL,
	`country` varchar(2) NOT NULL,
	`language` varchar(5) NOT NULL DEFAULT 'pt',
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`source` varchar(50) NOT NULL DEFAULT 'exit_intent',
	`status` enum('new','contacted','interested','converted','rejected') NOT NULL DEFAULT 'new',
	`zapierWebhookSent` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`zapierWebhookResponse` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
