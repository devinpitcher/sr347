CREATE TABLE `alert_cron_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`count` integer NOT NULL,
	`total_count` integer NOT NULL,
	`timestamp` text DEFAULT (current_timestamp) NOT NULL
);
