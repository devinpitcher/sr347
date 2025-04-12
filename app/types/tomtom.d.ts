export namespace TomTom {
  export interface RouteResponse {
    formatVersion: string;
    routes: Route[];
    optimizedWaypoints: OptimizedWaypoint[];
    report: Report;
  }

  export interface Route {
    summary: Summary;
    routeReassessments: RouteReassessment[];
    legs: Leg[];
    progress: Progress[];
    sections: Section[];
  }

  export interface Summary {
    lengthInMeters: number;
    travelTimeInSeconds: number;
    trafficDelayInSeconds: number;
    trafficLengthInMeters: number;
    departureTime: string;
    arrivalTime: string;
    noTrafficTravelTimeInSeconds: number;
    historicTrafficTravelTimeInSeconds: number;
    liveTrafficIncidentsTravelTimeInSeconds: number;
    batteryConsumptionInkWh: number;
    deviationDistance: number;
    deviationTime: number;
    deviationPoint: DeviationPoint;
    reachableRouteOffsets: ReachableRouteOffset[];
  }

  export interface DeviationPoint {
    latitude: number;
    longitude: number;
  }

  export interface ReachableRouteOffset {
    chargeMarginInkWh: number;
    routeOffsetInMeters: number;
    point: Point;
    pointIndex: number;
  }

  export interface Point {
    latitude: number;
    longitude: number;
  }

  export interface RouteReassessment {
    batteryConsumptionInkWh: number;
    reachableRouteOffsets: ReachableRouteOffset2[];
  }

  export interface ReachableRouteOffset2 {
    chargeMarginInkWh: number;
    routeOffsetInMeters: number;
    point: Point2;
    pointIndex: number;
  }

  export interface Point2 {
    latitude: number;
    longitude: number;
  }

  export interface Leg {
    summary: Summary2;
    points: Point3[];
    encodedPolyline: string;
    encodedPolylinePrecision: number;
  }

  export interface Summary2 {
    lengthInMeters: number;
    travelTimeInSeconds: number;
    trafficDelayInSeconds: number;
    trafficLengthInMeters: number;
    departureTime: string;
    arrivalTime: string;
    noTrafficTravelTimeInSeconds: number;
    historicTrafficTravelTimeInSeconds: number;
    liveTrafficIncidentsTravelTimeInSeconds: number;
    batteryConsumptionInkWh: number;
    originalWaypointIndexAtEndOfLeg: number;
    userDefinedPauseTimeInSeconds: number;
    entryPointIndexAtEndOfLeg: number;
  }

  export interface Point3 {
    latitude: number;
    longitude: number;
  }

  export interface Progress {
    pointIndex: number;
    travelTimeInSeconds: number;
    distanceInMeters: number;
    batteryConsumptionInkWh: number;
  }

  export interface Section {
    startPointIndex: number;
    endPointIndex: number;
    sectionType: string;
    travelMode?: string;
    tollPaymentTypes?: string[];
    simpleCategory?: string;
    effectiveSpeedInKmh?: number;
    delayInSeconds?: number;
    magnitudeOfDelay?: number;
    tec?: Tec;
    handsFreeDrivingSpeedInKmh?: number;
    importantRoadStretchIndex?: number;
    streetName?: StreetName;
    roadNumbers?: RoadNumber[];
  }

  export interface Tec {
    effectCode: number;
    causes: Cause[];
  }

  export interface Cause {
    mainCauseCode: number;
    subCauseCode?: number;
  }

  export interface StreetName {
    text: string;
  }

  export interface RoadNumber {
    text: string;
  }

  export interface OptimizedWaypoint {
    providedIndex: number;
    optimizedIndex: number;
  }

  export interface Report {
    effectiveSettings: EffectiveSetting[];
  }

  export interface EffectiveSetting {
    key: string;
    value: string;
  }
}
