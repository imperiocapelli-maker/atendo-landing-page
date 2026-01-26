CREATE TABLE `coupons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`discountType` enum('percentage','fixed') NOT NULL DEFAULT 'percentage',
	`discountValue` decimal(10,2) NOT NULL,
	`maxUses` int,
	`currentUses` int NOT NULL DEFAULT 0,
	`minPurchaseAmount` decimal(10,2),
	`validFrom` timestamp NOT NULL DEFAULT (now()),
	`validUntil` timestamp,
	`applicablePlans` text,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_unique` UNIQUE(`code`)
);
