import { createFileRoute } from "@tanstack/react-router";
import { getCurrentAlerts } from "~/lib/alerts";

export const Route = createFileRoute("/api/alerts")({
  server: {
    handlers: {
      GET: async () => {
        const alerts = await getCurrentAlerts();
        return Response.json({ alerts });
      },
    },
  },
});
