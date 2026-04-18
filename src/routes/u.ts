import { createFileRoute, redirect } from "@tanstack/react-router";
import { proxyRequest } from "~/lib/proxy";
import { UMAMI_DOMAIN, UMAMI_ENDPOINT } from "~/constants/umami";

export const Route = createFileRoute("/u")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        if (request.method === "GET") {
          throw redirect({ to: "/" });
        }

        return proxyRequest(new URL(UMAMI_ENDPOINT, UMAMI_DOMAIN), request);
      },
    },
  },
});
