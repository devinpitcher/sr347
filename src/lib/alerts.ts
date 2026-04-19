import { AZ511Service } from "~/services/az511";
import { env } from "cloudflare:workers";
import { db } from "~/database/client";
import { alertCronLogTable, alertsTable } from "~/database/schema";
import { buildConflictUpdateColumns } from "~/database/utils";

export async function updateAlerts() {
  const az511 = new AZ511Service(env.AZ511_API_KEY);
  const { alerts, allAlertCount } = await az511.get347Alerts();
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

  await db.batch([
    db.insert(alertCronLogTable).values({
      count: alerts.length,
      totalCount: allAlertCount,
    }),
    ...operations,
  ]);

  return alerts;
}
