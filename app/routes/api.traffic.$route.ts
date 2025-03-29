import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { ROUTES } from "~/constants/routes";
import { type DistanceMatrixResponseData } from "@googlemaps/google-maps-services-js";
import { Redis } from "@upstash/redis/cloudflare";
import dayjs from "dayjs";
import { determineNextTrafficUpdate } from "~/utils/traffic";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const {
    ctx: { waitUntil },
    env: { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL, CF_PAGES_COMMIT_SHA, MAPS_API_KEY },
  } = context.cloudflare;

  const matchedRoute = ROUTES.find(({ key }) => key.toLowerCase() === params.route!.toLowerCase());

  if (!matchedRoute) {
    return new Response(null, {
      status: 404,
      statusText: "Route not found",
    });
  }

  const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  });

  const key = `route-${matchedRoute.key}`;
  const lockKey = `route-${matchedRoute.key}-lock`;
  const cachedValue = await redis.get<TrafficResponse>(key);

  const updateCachedTraffic = async () => {
    const trafficResponse = await computeTraffic(matchedRoute, MAPS_API_KEY);
    await redis.set(key, trafficResponse);
    await redis.del(lockKey);

    return trafficResponse;
  };

  if (cachedValue !== null) {
    if (!MAPS_API_KEY) {
      return Response.json({
        ...cachedValue,
        appVersion: CF_PAGES_COMMIT_SHA,
      } satisfies WithAppVersion<TrafficResponse>);
    }

    const isStale = !cachedValue.nextUpdate || dayjs().isSameOrAfter(dayjs(cachedValue.nextUpdate));

    if (isStale) {
      const hasLock = Boolean(await redis.exists(lockKey));

      if (hasLock) {
        return Response.json({
          ...cachedValue,
          appVersion: CF_PAGES_COMMIT_SHA,
        } satisfies WithAppVersion<TrafficResponse>);
      }

      await redis.set(lockKey, true, { ex: 60 });

      waitUntil(updateCachedTraffic());
    }

    return Response.json({
      ...cachedValue,
      appVersion: CF_PAGES_COMMIT_SHA,
    } satisfies WithAppVersion<TrafficResponse>);
  }

  const trafficResponse = await updateCachedTraffic();

  return Response.json({
    ...trafficResponse,
    appVersion: CF_PAGES_COMMIT_SHA,
  } satisfies WithAppVersion<TrafficResponse>);
};

async function computeTraffic(route: Route, apiKey: string): Promise<TrafficResponse> {
  if (!apiKey) throw new Error("Google Maps API key required");

  const now = new Date();

  const results = await Promise.all(
    [route.outbound, route.inbound].map(async (segment) => {
      const requestUrl = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");

      requestUrl.searchParams.append("origins", segment.origin.toString());
      requestUrl.searchParams.append("destinations", segment.destination.toString());
      requestUrl.searchParams.set("mode", "driving");
      requestUrl.searchParams.set("traffic_model", "best_guess");
      requestUrl.searchParams.set("units", "imperial");
      requestUrl.searchParams.set("departure_time", toTimestamp(now).toString());
      requestUrl.searchParams.set("key", apiKey);

      const result = await fetch(requestUrl);

      return (await result.json()) as DistanceMatrixResponseData;
    })
  );

  const routeResponse = {
    key: route.key,
    outbound: {
      duration: results[0].rows[0].elements[0].duration.value,
      duration_in_traffic: results[0].rows[0].elements[0].duration_in_traffic.value,
    },
    inbound: {
      duration: results[1].rows[0].elements[0].duration.value,
      duration_in_traffic: results[1].rows[0].elements[0].duration_in_traffic.value,
    },
  } satisfies RouteResponse;

  const nextUpdate = determineNextTrafficUpdate(routeResponse).toISOString();

  return {
    route: routeResponse,
    lastUpdated: now.toISOString(),
    nextUpdate,
  };
}

function toTimestamp(o: "now" | number | Date): number | "now" {
  if (o === "now") {
    return o;
  }

  if (o instanceof Date) {
    return Math.round(Number(o) / 1000);
  }

  return o;
}
