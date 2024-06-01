import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Redis } from "@upstash/redis/cloudflare";
import dayjs from "dayjs";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const {
    ctx: { waitUntil },
    env: { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL, AZ511_API_KEY },
  } = context.cloudflare;

  const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  });

  const value = await redis.get<TrafficResponse>("alerts");

  const updateCachedAlerts = async () => {
    const response = await fetch(`https://az511.com/api/v2/get/event?key=${AZ511_API_KEY}`);
    const allAlerts = (await response.json()) as Alert[];
    const alerts = allAlerts.filter((alert) => alert.RoadwayName.toUpperCase() === "SR-347");

    await redis.set("alerts", alerts);

    return alerts;
  };

  if (value !== null) {
    const expires = dayjs(value.lastUpdated).add(5, "minutes");

    if (dayjs().isSameOrAfter(expires)) {
      waitUntil(updateCachedAlerts());
    }

    return Response.json(value);
  }

  const alerts = await updateCachedAlerts();

  return Response.json(alerts);
};
