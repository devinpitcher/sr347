import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { AZ511 } from "~/types/az511";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const trafficTable = sqliteTable("traffic", {
  id: integer(),
});

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
