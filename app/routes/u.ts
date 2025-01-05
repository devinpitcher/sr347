import { ActionFunction, LoaderFunction, redirect } from "@remix-run/cloudflare";
import { proxyRequest } from "~/utils/proxy";
import { UMAMI_DOMAIN, UMAMI_ENDPOINT } from "~/utils/umami";

export const action: ActionFunction = async ({ request }) => {
  return proxyRequest(new URL(UMAMI_ENDPOINT, UMAMI_DOMAIN).toString(), request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
