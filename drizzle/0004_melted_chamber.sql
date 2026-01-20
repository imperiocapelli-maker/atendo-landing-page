CREATE TABLE `fixedCosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rentCost` decimal(10,2) NOT NULL DEFAULT '0',
	`rentFrequency` enum('monthly','yearly') NOT NULL DEFAULT 'monthly',
	`employeeCount` int NOT NULL DEFAULT 0,
	`averageSalary` decimal(10,2) NOT NULL DEFAULT '0',
	`utilitiesCost` decimal(10,2) NOT NULL DEFAULT '0',
	`insuranceCost` decimal(10,2) NOT NULL DEFAULT '0',
	`maintenanceCost` decimal(10,2) NOT NULL DEFAULT '0',
	`marketingCost` decimal(10,2) NOT NULL DEFAULT '0',
	`materialsCost` decimal(10,2) NOT NULL DEFAULT '0',
	`softwareLicenses` decimal(10,2) NOT NULL DEFAULT '0',
	`otherCosts` decimal(10,2) NOT NULL DEFAULT '0',
	`otherCostsDescription` text,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fixedCosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricingConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`desiredProfitMargin` decimal(5,2) NOT NULL DEFAULT '30',
	`workingDaysPerMonth` int NOT NULL DEFAULT 22,
	`workingHoursPerDay` decimal(4,2) NOT NULL DEFAULT '8',
	`averageServiceDuration` decimal(5,2) NOT NULL DEFAULT '60',
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pricingConfig_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricingHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalMonthlyCost` decimal(10,2) NOT NULL,
	`costPerDay` decimal(10,2) NOT NULL,
	`costPerHour` decimal(10,2) NOT NULL,
	`costPerService` decimal(10,2) NOT NULL,
	`suggestedServicePrice` decimal(10,2) NOT NULL,
	`suggestedHourlyRate` decimal(10,2) NOT NULL,
	`projectedMonthlyRevenue` decimal(10,2) NOT NULL,
	`projectedMonthlyProfit` decimal(10,2) NOT NULL,
	`profitMarginAchieved` decimal(5,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pricingHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `fixedCosts` ADD CONSTRAINT `fixedCosts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pricingConfig` ADD CONSTRAINT `pricingConfig_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pricingHistory` ADD CONSTRAINT `pricingHistory_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;