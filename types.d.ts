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

  type Point = [number, number];

  type Segment = {
    description: string;
    origin: Point;
    destination: Point;
  };

  export type Route = {
    key: string;
    outbound: Segment;
    inbound: Segment;
  };

  export type SegmentResponse = {
    duration: number;
    duration_in_traffic: number;
  };

  export type RouteResponse = {
    key: string;
    outbound: SegmentResponse;
    inbound: SegmentResponse;
  };

  export type TrafficResponse = {
    route: RouteResponse;
    lastUpdated: string;
  };
}

export {};
