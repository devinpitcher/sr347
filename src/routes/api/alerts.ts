import { createFileRoute } from "@tanstack/react-router";
import { Redis } from "@upstash/redis/cloudflare";
import { env, waitUntil } from "cloudflare:workers";
import { dayjs } from "~/lib/dayjs";

export const Route = createFileRoute("/api/alerts")({
  server: {
    handlers: {
      GET: async () => {
        const redis = new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        });

        const value = await redis.get<AlertsResponse>("alerts");

        const updateCachedAlerts = async (): Promise<AlertsResponse> => {
          const response = await fetch(`https://az511.com/api/v2/get/event?key=${env.AZ511_API_KEY}`);
          const allAlerts = (await response.json()) as Alert[];
          const alerts = allAlerts.filter((alert) => {
            if (!alert.RoadwayName) return false;
            const roadwayName = alert.RoadwayName.toUpperCase();
            return /(SR|AZ?)[-\s]?347/gi.test(roadwayName);
          });

          const data = {
            alerts,
            lastUpdated: dayjs().toISOString(),
          };

          await redis.set("alerts", data);

          return data;
        };

        if (value !== null) {
          const expires = dayjs(value.lastUpdated).add(5, "minutes");

          if (dayjs().isSameOrAfter(expires)) {
            waitUntil(updateCachedAlerts());
          }

          return Response.json(value.alerts);
        }

        const { alerts } = await updateCachedAlerts();

        return Response.json(alerts);
      },
    },
  },
});
