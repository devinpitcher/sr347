import { createServerFn } from "@tanstack/react-start";
import { desc, eq, getTableColumns, gte } from "drizzle-orm";
import { alertsTable } from "~/database/schema";
import { db } from "~/database/client";
import { z } from "zod";

export const getCurrentAlerts = createServerFn({ method: "GET" }).handler(async () => {
  const { raw, ...columns } = getTableColumns(alertsTable);
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  return db.select(columns).from(alertsTable).where(gte(alertsTable.lastSeen, twoHoursAgo)).orderBy(desc(alertsTable.alertId));
});
