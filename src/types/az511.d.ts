export namespace AZ511 {
  export type Alert = {
    Description: string;
    Details: string;
    DetourInstructions: string | null;
    DetourPolyline: string | null;
    DirectionOfTravel: string | null;
    EncodedPolyline: string;
    EventSubType: string;
    EventType: "closures" | "roadwork" | "restrictionClass" | "accidentsAndIncidents" | "specialEvents";
    ID: number;
    IsFullClosure: boolean;
    LaneCount: number;
    LanesAffected: string;
    LastUpdated: number;
    Latitude: number;
    LatitudeSecondary: number | null;
    Longitude: number;
    LongitudeSecondary: number | null;
    Organization: string;
    PlannedEndDate?: number;
    Recurrence: string;
    RecurrenceSchedules: AlertRecurrenceSchedule[];
    Reported: number;
    Restrictions: AlertRestrictions;
    RoadwayName: string | null;
    Severity: "Minor" | "Major" | "None" | "";
    SourceId: string;
    StartDate: number;
  };

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
}
