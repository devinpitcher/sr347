import type { LoaderFunction } from "@remix-run/cloudflare";
import { UMAMI_DOMAIN, UMAMI_ENDPOINT } from "~/utils/umami";

export const loader: LoaderFunction = async () => {
  const res = await fetch(new URL("/script.js", UMAMI_DOMAIN));
  const jsRaw = await res.text();
  const js = jsRaw.replaceAll(UMAMI_ENDPOINT, "/u");

  return new Response(js, {
    status: res.status,
    statusText: res.statusText,
    headers: {
      "content-type": res.headers.get("content-type")!,
      "content-length": js.length.toString(),
      "cache-control": "public, max-age=300",
    },
  });
};
