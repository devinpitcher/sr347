import { createFileRoute } from "@tanstack/react-router";
import { db } from "~/database/client";
import { alertsTable } from "~/database/schema";
import { getTableColumns } from "drizzle-orm";

export const Route = createFileRoute("/api/alerts")({
  server: {
    handlers: {
      GET: async () => {
        const { raw, ...columns } = getTableColumns(alertsTable);
        const alerts = await db.select(columns).from(alertsTable);

        return Response.json({
          alerts,
          lastUpdated: Date.now(),
        });
      },
    },
  },
});
