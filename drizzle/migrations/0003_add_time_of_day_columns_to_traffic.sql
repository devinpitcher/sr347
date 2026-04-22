ALTER TABLE `traffic` ADD `day_of_week` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `traffic` ADD `time_of_day` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE `traffic` SET `day_of_week` = CAST(strftime('%w', `query_timestamp`, 'unixepoch') AS INTEGER),
                     `time_of_day` = `query_timestamp` - CAST(strftime('%s', `query_timestamp`, 'unixepoch', 'start of day') AS INTEGER);--> statement-breakpoint
CREATE INDEX `traffic_route_id_day_of_week_time_of_day_idx` ON `traffic` (`route_id`,`day_of_week`,`time_of_day`);
