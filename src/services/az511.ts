import { AZ511 } from "~/types/az511";

export class AZ511Service {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async getAlerts() {
    const response = await fetch(`https://az511.com/api/v2/get/event?key=${this.apiKey}`);

    if (!response.ok) {
      throw new Error(`Failed to get alerts: ${response.status ?? "Unknown status"}`);
    }

    const allAlerts = (await response.json()) as AZ511.Alert[];

    if (!Array.isArray(allAlerts)) {
      throw new Error(`Alerts expected to be an array, actually received ${typeof allAlerts}`);
    }

    return allAlerts.reduce(
      (acc, alert) => {
        // if (alert.RoadwayName && /(SR|AZ?)[-\s]?347/gi.test(alert.RoadwayName)) {
        //   acc.push(this.normalizeAlert(alert));
        // }

        if (alert.RoadwayName && /(SR|AZ?)[-\s]?2/gi.test(alert.RoadwayName)) {
          acc.push(this.normalizeAlert(alert));
        }

        return acc;
      },
      [] as ReturnType<typeof this.normalizeAlert>[]
    );
  }

  private normalizeAlert(alert: AZ511.Alert) {
    let severity: AlertSeverity | null = null;
    switch (alert.Severity) {
      case "Major":
        severity = "major";
        break;
      case "Minor":
        severity = "minor";
        break;
    }

    let direction: AlertDirection | null = null;
    if (alert.DirectionOfTravel) {
      const sourceDirection = alert.DirectionOfTravel.toLowerCase().replaceAll(/\s/g, "");
      if (sourceDirection.includes("north")) {
        direction = "north";
      } else if (sourceDirection.includes("east")) {
        direction = "east";
      } else if (sourceDirection.includes("south")) {
        direction = "south";
      } else if (sourceDirection.includes("west")) {
        direction = "west";
      } else if (sourceDirection.includes("both")) {
        direction = "both";
      } else if (sourceDirection.includes("all")) {
        direction = "all";
      }
    }

    let lanes: string | null = null;
    if (alert.LanesAffected !== "No Data") {
      lanes = alert.LanesAffected;
    }

    return {
      id: alert.ID,
      organization: alert.Organization,
      sourceId: alert.SourceId,

      type: alert.EventType,
      subtype: alert.EventSubType,
      severity,
      direction,
      lanes,

      description: alert.Description,
      details: alert.Details,

      latitude: alert.Latitude,
      longitude: alert.Longitude,
      latitudeSecondary: alert.LatitudeSecondary,
      longitudeSecondary: alert.LongitudeSecondary,
      encodedPolyline: alert.EncodedPolyline || null,

      reported: new Date(alert.Reported * 1000),
      lastUpdated: new Date(alert.LastUpdated * 1000),
      startDate: new Date(alert.StartDate * 1000),
      plannedEndDate: alert.PlannedEndDate ? new Date(alert.PlannedEndDate * 1000) : null,
      raw: alert,
    };
  }
}
