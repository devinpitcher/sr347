import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

export const getAppVersion = createServerFn().handler(async () => {
  return env.WORKERS_CI_COMMIT_SHA ?? "";
});
