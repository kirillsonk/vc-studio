CREATE TABLE `intake_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`hash` text NOT NULL,
	`payload` text NOT NULL,
	`status` text NOT NULL,
	`cursor` integer DEFAULT 0 NOT NULL,
	`updated` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `intake_leads_expiry` ON `intake_leads` (`expires`);