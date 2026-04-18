import { SelectAlert } from "~/database/schema";

declare global {
  type AlertDirection = "north" | "east" | "south" | "west" | "both" | "all";

  type AlertSeverity = "minor" | "major";

  type AlertType = "closures" | "roadwork" | "restrictionClass" | "accidentsAndIncidents" | "specialEvents";

  interface AlertsResponse {
    alerts: SelectAlert[];
    lastUpdated: number;
  }
}

export {};
