/// <reference types="vite-plugin-svgr/client" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;
      npm_config_user_agent?: string;
      CF_PAGES?: string;
      SHELL?: string;
      __NEXT_ON_PAGES__KV_SUSPENSE_CACHE?: KVNamespace;
      [key: string]: string | Fetcher;
    }
  }

  export type WithAppVersion<T extends object> = T & {
    appVersion?: string;
  };

  export interface AlertsResponse {
    alerts: Alert[];
    lastUpdated: string;
  }

  export interface Alert {
    Description: string;
    Details: string;
    DetourInstructions: string | null;
    DetourPolyline: string | null;
    DirectionOfTravel: string;
    EncodedPolyline: string;
    EventSubType: string;
    EventType: "closures" | "roadwork" | "restrictionClass" | "accidentsAndIncidents" | "specialEvents";
    ID: string;
    IsFullClosure: boolean;
    LaneCount: number;
    LanesAffected: string;
    LastUpdated: number;
    Latitude: number;
    LatitudeSecondary: number;
    Longitude: number;
    LongitudeSecondary: number;
    Organization: string;
    PlannedEndDate?: number;
    Recurrence: string;
    RecurrenceSchedules: AlertRecurrenceSchedule[];
    Reported: number;
    Restrictions: AlertRestrictions;
    RoadwayName: string;
    Severity: "minor" | "major" | null;
    StartDate: number;
  }

  export interface AlertRestrictions {
    Width?: number | null;
    Height?: number | null;
    Length: number | null;
    Weight: number | null;
    Speed: number | null;
  }

  export interface AlertRecurrenceSchedule extends AlertTime {
    Times: AlertTime[];
    DaysOfWeek: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
  }

  export interface AlertTime {
    StartTime: string;
    EndTime: string;
  }

  export interface CameraErrorResponse {
    lastSeen: string;
  }
}

export {};
