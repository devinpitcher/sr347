import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { AZ511Service } from "~/services/az511";
import { db } from "~/database/client";
import { alertsTable } from "~/database/schema";
import { buildConflictUpdateColumns } from "~/database/utils";
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
      POST: async () => {
        const az511 = new AZ511Service(env.AZ511_API_KEY);
        const alerts = await az511.getAlerts();
        const now = new Date();

        const operations = alerts.map(({ id, ...alert }) =>
          db
            .insert(alertsTable)
            .values({
              alertId: id,
              ...alert,
              firstSeen: now,
              lastSeen: now,
            })
            .onConflictDoUpdate({
              target: alertsTable.alertId,
              set: buildConflictUpdateColumns(alertsTable, ["id", "alertId", "firstSeen", "aiSummary"], true),
            })
        );

        await db.batch(operations as [(typeof operations)[0], ...typeof operations]);

        return Response.json({
          success: true,
          alerts,
        });
      },
    },
  },
});
