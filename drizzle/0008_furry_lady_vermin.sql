ALTER TABLE `users` ADD `isTrialActive` tinyint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `trialEndDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `trialPlanName` varchar(64) DEFAULT 'premium';