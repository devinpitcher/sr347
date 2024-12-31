import type { ActionFunction } from "@remix-run/cloudflare";
import { proxyRequest } from "~/utils/proxy";

export const action: ActionFunction = async ({ request }) => {
  return proxyRequest("https://cloud.umami.is/api/send", request);
};
