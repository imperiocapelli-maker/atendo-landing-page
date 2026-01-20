CREATE TABLE `pricingSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rentCost` decimal(10,2) NOT NULL DEFAULT '0',
	`employeeCount` int NOT NULL DEFAULT 0,
	`averageSalary` decimal(10,2) NOT NULL DEFAULT '0',
	`utilitiesCost` decimal(10,2) NOT NULL DEFAULT '0',
	`insuranceCost` decimal(10,2) NOT NULL DEFAULT '0',
	`maintenanceCost` decimal(10,2) NOT NULL DEFAULT '0',
	`marketingCost` decimal(10,2) NOT NULL DEFAULT '0',
	`materialsCost` decimal(10,2) NOT NULL DEFAULT '0',
	`softwareLicenses` decimal(10,2) NOT NULL DEFAULT '0',
	`otherCosts` decimal(10,2) NOT NULL DEFAULT '0',
	`desiredProfitMargin` decimal(5,2) NOT NULL DEFAULT '30',
	`cardTaxPercentage` decimal(5,2) NOT NULL DEFAULT '0',
	`taxPercentage` decimal(5,2) NOT NULL DEFAULT '0',
	`workingDaysPerMonth` int NOT NULL DEFAULT 22,
	`workingHoursPerDay` decimal(4,2) NOT NULL DEFAULT '8',
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pricingSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `pricingSettings_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`commissionPercentage` decimal(5,2) NOT NULL DEFAULT '0',
	`productCost` decimal(10,2) NOT NULL DEFAULT '0',
	`currentPrice` decimal(10,2) NOT NULL,
	`suggestedPrice` decimal(10,2),
	`profitMargin` decimal(5,2),
	`profitAmount` decimal(10,2),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `pricingSettings` ADD CONSTRAINT `pricingSettings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;