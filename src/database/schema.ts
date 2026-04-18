import { sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const traffic = sqliteTable("traffic", {
  id: integer(),
});

export const alerts = sqliteTable("alerts", {
  id: integer(),
});
