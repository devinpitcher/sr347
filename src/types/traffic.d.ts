export namespace Traffic {
  export type RouteDefinition = {
    key: string;
    name: string;
    outbound: SegmentDefinition;
    inbound: SegmentDefinition;
    duration?: number;
  };

  export type SegmentDefinition = {
    description: string;
    origin: Point;
    destination: Point;
  };

  export type Point = [number, number];

  export type RouteResponse = {
    route: Route;
    lastUpdated: string;
    nextUpdate: string;
  };

  export type Route = {
    key: string;
    outbound: RouteTraffic;
    inbound: RouteTraffic;
  };

  export type RouteTraffic = {
    duration: number;
    duration_in_traffic: number;
  };
}
