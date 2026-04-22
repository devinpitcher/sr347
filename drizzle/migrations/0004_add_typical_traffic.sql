ALTER TABLE `traffic` ADD `inbound_typical_duration` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `traffic` ADD `inbound_typical_duration_in_traffic` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `traffic` ADD `outbound_typical_duration` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `traffic` ADD `outbound_typical_duration_in_traffic` integer DEFAULT 0;