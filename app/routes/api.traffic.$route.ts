import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { ROUTES } from "~/constants/routes";
import { Redis } from "@upstash/redis/cloudflare";
import dayjs from "dayjs";
import { determineNextTrafficUpdate } from "~/utils/traffic";
import { TomTomService } from "~/services/tomtom";
import { Traffic } from "~/types/traffic";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const {
    ctx: { waitUntil },
    env: { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL, CF_PAGES_COMMIT_SHA, TOMTOM_API_KEY },
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
  const cachedValue = await redis.get<Traffic.RouteResponse>(key);

  const tomtom = new TomTomService(TOMTOM_API_KEY);

  const updateCachedTraffic = async (): Promise<Traffic.RouteResponse> => {
    const inbound = await tomtom.getRoute(matchedRoute.inbound.origin.join(","), matchedRoute.inbound.destination.join(","));
    const outbound = await tomtom.getRoute(matchedRoute.outbound.origin.join(","), matchedRoute.outbound.destination.join(","));

    const route: Traffic.Route = {
      key: matchedRoute.key,
      inbound,
      outbound,
    };

    const now = new Date();
    const nextUpdate = determineNextTrafficUpdate(route).toISOString();

    const response: Traffic.RouteResponse = {
      route,
      lastUpdated: now.toISOString(),
      nextUpdate,
      source: "tomtom",
    };

    await redis.set(key, response);
    await redis.del(lockKey);

    return response;
  };

  if (cachedValue !== null) {
    if (!TOMTOM_API_KEY) {
      return Response.json({
        ...cachedValue,
        appVersion: CF_PAGES_COMMIT_SHA,
      } satisfies WithAppVersion<Traffic.RouteResponse>);
    }

    const isStale = !cachedValue.nextUpdate || dayjs().isSameOrAfter(dayjs(cachedValue.nextUpdate));

    if (isStale) {
      const hasLock = Boolean(await redis.exists(lockKey));

      if (hasLock) {
        return Response.json({
          ...cachedValue,
          appVersion: CF_PAGES_COMMIT_SHA,
        } satisfies WithAppVersion<Traffic.RouteResponse>);
      }

      await redis.set(lockKey, true, { ex: 60 });

      waitUntil(updateCachedTraffic());
    }

    return Response.json({
      ...cachedValue,
      appVersion: CF_PAGES_COMMIT_SHA,
    } satisfies WithAppVersion<Traffic.RouteResponse>);
  }

  const trafficResponse = await updateCachedTraffic();

  return Response.json({
    ...trafficResponse,
    appVersion: CF_PAGES_COMMIT_SHA,
  } satisfies WithAppVersion<Traffic.RouteResponse>);
};
