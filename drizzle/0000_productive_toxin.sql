CREATE TABLE `intake_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `intake_limits_expiry` ON `intake_limits` (`expires`);