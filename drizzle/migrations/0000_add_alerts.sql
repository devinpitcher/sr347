CREATE TABLE `alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`alert_id` integer NOT NULL,
	`source_id` text,
	`organization` text,
	`type` text NOT NULL,
	`subtype` text,
	`direction` text,
	`severity` text,
	`description` text,
	`details` text,
	`lanes` text,
	`ai_summary` text,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`latitude_secondary` real,
	`longitude_secondary` real,
	`encoded_polyline` text,
	`reported` integer,
	`last_updated` integer,
	`start_date` integer,
	`planned_end_date` integer,
	`raw` text NOT NULL,
	`first_seen` integer NOT NULL,
	`last_seen` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `alerts_alertId_unique` ON `alerts` (`alert_id`);