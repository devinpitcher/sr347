export async function getAlerts(apiKey: string): Promise<Alert[]> {
  const response = await fetch(`https://az511.com/api/v2/get/event?key=${apiKey}`);
  const alerts = (await response.json()) as Alert[];

  return alerts.filter((alert) => alert.RoadwayName.toUpperCase() === "SR-347");
}
