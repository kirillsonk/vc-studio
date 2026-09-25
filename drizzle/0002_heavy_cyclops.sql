CREATE TABLE `intake_receipts` (
	`number` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lead_id` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `intake_receipts_lead_id_unique` ON `intake_receipts` (`lead_id`);