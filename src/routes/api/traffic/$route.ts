import { createFileRoute } from "@tanstack/react-router";
import { env, waitUntil } from "cloudflare:workers";
import { APP_VERSION, APP_VERSION_HEADER } from "~/constants/app";
import { Redis } from "@upstash/redis/cloudflare";
import dayjs from "dayjs";
import { ROUTES } from "~/constants/routes";
import { Traffic } from "~/types/traffic";
import { TomTomService } from "~/services/tomtom";
import { determineNextTrafficUpdate } from "~/lib/traffic";

export const Route = createFileRoute("/api/traffic/$route")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const matchedRoute = ROUTES.find(({ key }) => key.toLowerCase() === params.route!.toLowerCase());

        if (!matchedRoute) {
          return new Response(null, {
            status: 404,
            statusText: "Route not found",
          });
        }

        const redis = new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        });

        const key = `route-${matchedRoute.key}`;
        const lockKey = `route-${matchedRoute.key}-lock`;
        const cachedValue = await redis.get<Traffic.RouteResponse>(key);

        const tomtom = new TomTomService(env.TOMTOM_API_KEY);

        const updateCachedTraffic = async (): Promise<Traffic.RouteResponse> => {
          const inbound = await tomtom.getRoute(matchedRoute.inbound.origin.join(","), matchedRoute.inbound.destination.join(","), matchedRoute.duration);
          const outbound = await tomtom.getRoute(matchedRoute.outbound.origin.join(","), matchedRoute.outbound.destination.join(","), matchedRoute.duration);

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
          if (!env.TOMTOM_API_KEY) {
            return Response.json({
              ...cachedValue,
              [APP_VERSION_HEADER]: APP_VERSION,
            } satisfies WithAppVersion<Traffic.RouteResponse>);
          }

          const isStale = !cachedValue.nextUpdate || dayjs().isSameOrAfter(dayjs(cachedValue.nextUpdate));

          if (isStale) {
            const hasLock = Boolean(await redis.exists(lockKey));

            if (hasLock) {
              return Response.json({
                ...cachedValue,
                [APP_VERSION_HEADER]: APP_VERSION,
              } satisfies WithAppVersion<Traffic.RouteResponse>);
            }

            await redis.set(lockKey, true, { ex: 60 });

            waitUntil(updateCachedTraffic());
          }

          return Response.json({
            ...cachedValue,
            [APP_VERSION_HEADER]: APP_VERSION,
          } satisfies WithAppVersion<Traffic.RouteResponse>);
        }

        const trafficResponse = await updateCachedTraffic();

        return Response.json({
          ...trafficResponse,
          [APP_VERSION_HEADER]: APP_VERSION,
        } satisfies WithAppVersion<Traffic.RouteResponse>);
      },
    },
  },
});
