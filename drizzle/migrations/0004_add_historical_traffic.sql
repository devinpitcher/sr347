ALTER TABLE `traffic` ADD `inbound_traffic_delay` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `traffic` ADD `inbound_historical_duration_in_traffic` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `traffic` ADD `outbound_traffic_delay` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `traffic` ADD `outbound_historical_duration_in_traffic` integer DEFAULT 0;