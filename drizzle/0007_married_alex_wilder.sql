CREATE TABLE `pendingUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`planId` int NOT NULL,
	`stripeCheckoutSessionId` varchar(255) NOT NULL,
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`tempPassword` varchar(255) NOT NULL,
	`passwordResetToken` varchar(255),
	`passwordResetExpires` timestamp,
	`status` enum('pending','confirmed','failed') NOT NULL DEFAULT 'pending',
	`emailSent` int NOT NULL DEFAULT 0,
	`emailSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pendingUsers_id` PRIMARY KEY(`id`),
	CONSTRAINT `pendingUsers_email_unique` UNIQUE(`email`),
	CONSTRAINT `pendingUsers_stripeCheckoutSessionId_unique` UNIQUE(`stripeCheckoutSessionId`)
);
--> statement-breakpoint
ALTER TABLE `pendingUsers` ADD CONSTRAINT `pendingUsers_planId_subscriptionPlans_id_fk` FOREIGN KEY (`planId`) REFERENCES `subscriptionPlans`(`id`) ON DELETE restrict ON UPDATE no action;