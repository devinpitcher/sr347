import { createFileRoute } from "@tanstack/react-router";
import { desc, getTableColumns, gte } from "drizzle-orm";
import { alertsTable } from "~/database/schema";
import { db } from "~/database/client";

export const Route = createFileRoute("/api/alerts")({
  server: {
    handlers: {
      GET: async () => {
        const { raw: _raw, ...columns } = getTableColumns(alertsTable);
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const alerts = await db.select(columns).from(alertsTable).where(gte(alertsTable.lastSeen, twoHoursAgo)).orderBy(desc(alertsTable.alertId));

        return Response.json({ alerts });
      },
    },
  },
});
