/// <reference types="vite-plugin-svgr/client" />

import { APP_VERSION_HEADER } from "~/constants/app";

declare global {
  export type WithAppVersion<T extends object> = T & {
    [APP_VERSION_HEADER]?: string;
  };

  export interface CameraErrorResponse {
    lastSeen: string;
  }
}

export {};
