import type { LoaderFunction } from "@remix-run/cloudflare";
import { proxyRequest } from "~/utils/proxy";

export const loader: LoaderFunction = async ({ request }) => {
  return proxyRequest("https://cloud.umami.is/script.js", request);
};
