import { AZ511Service } from "~/services/az511";
import { env } from "cloudflare:workers";
import { db } from "~/database/client";
import { alertsTable } from "~/database/schema";
import { buildConflictUpdateColumns } from "~/database/utils";
import { desc, getTableColumns, gte } from "drizzle-orm";

export async function getCurrentAlerts() {
  const { raw, ...columns } = getTableColumns(alertsTable);
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  return db.select(columns).from(alertsTable).where(gte(alertsTable.lastSeen, twoHoursAgo)).orderBy(desc(alertsTable.alertId));
}

export async function updateAlerts() {
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
}
