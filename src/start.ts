import { createStart, createMiddleware } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { APP_VERSION, APP_VERSION_HEADER } from "~/constants/app";

const globalMiddleware = createMiddleware({ type: "request" }).server(async ({ next }) => {
  setResponseHeader(APP_VERSION_HEADER, APP_VERSION);
  return next();
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [globalMiddleware],
  };
});
