import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { UmamiRealtimeResponse } from "~/types/umami";
import { UMAMI_WEBSITE_ID } from "~/constants/umami";

export const Route = createFileRoute("/api/realtime")({
  server: {
    handlers: {
      GET: async () => {
        const data = await fetch(`https://api.umami.is/v1/websites/${UMAMI_WEBSITE_ID}/active`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.UMAMI_API_KEY}`,
            Accept: "application/json",
          },
        })
          .then((res) => res.json() as unknown as UmamiRealtimeResponse)
          .catch(() => null);

        if (data == null) {
          return Response.json(
            {},
            {
              status: 500,
            }
          );
        }

        return Response.json(data);
      },
    },
  },
});
