CREATE TABLE `traffic` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`route_id` text NOT NULL,
	`inbound_duration` integer NOT NULL,
	`inbound_duration_in_traffic` integer NOT NULL,
	`outbound_duration` integer NOT NULL,
	`outbound_duration_in_traffic` integer NOT NULL,
	`query_timestamp` integer NOT NULL,
	`next_update` integer NOT NULL
);
