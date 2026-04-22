import { sqliteTable, integer, text, real, index, numeric } from "drizzle-orm/sqlite-core";
import { AZ511 } from "~/types/az511";
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";

export const alertsTable = sqliteTable("alerts", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  alertId: integer().notNull().unique(),
  sourceId: text(),
  organization: text(),

  type: text().$type<AlertType>().notNull(),
  subtype: text(),
  direction: text().$type<AlertDirection>(),
  severity: text().$type<AlertSeverity>(),

  description: text(),
  details: text(),
  lanes: text(),
  aiSummary: text(),

  latitude: real().notNull(),
  longitude: real().notNull(),
  latitudeSecondary: real(),
  longitudeSecondary: real(),
  encodedPolyline: text(),

  reported: integer({ mode: "timestamp_ms" }),
  lastUpdated: integer({ mode: "timestamp_ms" }),
  startDate: integer({ mode: "timestamp_ms" }),
  plannedEndDate: integer({ mode: "timestamp_ms" }),

  raw: text({ mode: "json" }).notNull().$type<AZ511.Alert>(),

  firstSeen: integer({ mode: "timestamp_ms" }).notNull(),
  lastSeen: integer({ mode: "timestamp_ms" }).notNull(),
});

export type SelectAlert = InferSelectModel<typeof alertsTable>;
export type InsertAlert = InferInsertModel<typeof alertsTable>;

export const alertCronLogTable = sqliteTable("alert_cron_log", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  count: integer({ mode: "number" }).notNull(),
  totalCount: integer({ mode: "number" }).notNull(),
  timestamp: text("timestamp")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const trafficTable = sqliteTable(
  "traffic",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    routeId: text().notNull(),
    inboundDuration: integer({ mode: "number" }).notNull(),
    inboundDurationInTraffic: integer({ mode: "number" }).notNull(),
    inboundTrafficDelay: integer({ mode: "number" }).default(0),
    inboundHistoricalDurationInTraffic: integer({ mode: "number" }).default(0),
    outboundDuration: integer({ mode: "number" }).notNull(),
    outboundDurationInTraffic: integer({ mode: "number" }).notNull(),
    outboundTrafficDelay: integer({ mode: "number" }).default(0),
    outboundHistoricalDurationInTraffic: integer({ mode: "number" }).default(0),
    dayOfWeek: integer({ mode: "number" }).notNull().default(0),
    timeOfDay: integer({ mode: "number" }).notNull().default(0),
    queryTimestamp: integer({ mode: "timestamp" }).notNull(),
    nextUpdate: integer({ mode: "timestamp" }).notNull(),
  },
  (t) => [index("traffic_route_id_day_of_week_time_of_day_idx").on(t.routeId, t.dayOfWeek, t.timeOfDay)]
);

export const d1Migrations = sqliteTable("d1_migrations", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text(),
  appliedAt: numeric("applied_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
