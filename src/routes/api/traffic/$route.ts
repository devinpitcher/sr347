import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { Redis } from "@upstash/redis/cloudflare";
import dayjs from "dayjs";
import { ROUTES } from "~/constants/routes";
import { Traffic } from "~/types/traffic";
import { TomTomService } from "~/services/tomtom";
import { db } from "~/database/client";
import { trafficTable } from "~/database/schema";
import { desc, eq } from "drizzle-orm";

const tomtom = new TomTomService(env.TOMTOM_API_KEY);
const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const Route = createFileRoute("/api/traffic/$route")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const matchedRoute = ROUTES.find(({ key }) => key.toLowerCase() === params.route!.toLowerCase());
        if (!matchedRoute) {
          return new Response("Route not found", { status: 404 });
        }

        const lockKey = `route-${matchedRoute.key}-lock`;

        const queryResult = await db.select().from(trafficTable).where(eq(trafficTable.routeId, matchedRoute.key)).orderBy(desc(trafficTable.id)).limit(1);

        const currentValue = queryResult.pop();

        if (currentValue != null) {
          const currentValueResponse = {
            route: {
              key: currentValue.routeId,
              inbound: {
                duration: currentValue.inboundDuration,
                duration_in_traffic: currentValue.inboundDurationInTraffic,
              },
              outbound: {
                duration: currentValue.outboundDuration,
                duration_in_traffic: currentValue.outboundDurationInTraffic,
              },
            },
            lastUpdated: currentValue.queryTimestamp.toISOString(),
            nextUpdate: currentValue.nextUpdate.toISOString(),
          } satisfies Traffic.RouteResponse;

          if (!env.TOMTOM_API_KEY) {
            return Response.json(currentValueResponse);
          }

          const isStale = dayjs().isSameOrAfter(dayjs(currentValue.queryTimestamp).add(5, "minutes"));
          if (!isStale) {
            return Response.json(currentValueResponse);
          }

          const hasLock = Boolean(await redis.exists(lockKey));
          if (hasLock) {
            return Response.json(currentValueResponse);
          }

          await redis.set(lockKey, true, { ex: 60 });
        }

        const queryTime = dayjs();
        const nextUpdate = queryTime.clone().add(5, "minutes");

        const inbound = await tomtom.getRoute({
          origin: matchedRoute.inbound.origin.join(","),
          destination: matchedRoute.inbound.destination.join(","),
          routeDuration: matchedRoute.duration,
        });

        const outbound = await tomtom.getRoute({
          origin: matchedRoute.outbound.origin.join(","),
          destination: matchedRoute.outbound.destination.join(","),
          routeDuration: matchedRoute.duration,
        });

        await db.insert(trafficTable).values({
          routeId: matchedRoute.key,
          inboundDuration: inbound.duration,
          inboundDurationInTraffic: inbound.duration_in_traffic,
          outboundDuration: outbound.duration,
          outboundDurationInTraffic: outbound.duration_in_traffic,
          dayOfWeek: queryTime.day(),
          timeOfDay: queryTime.diff(queryTime.startOf("day"), "seconds"),
          queryTimestamp: queryTime.toDate(),
          nextUpdate: nextUpdate.toDate(),
        });

        await redis.del(lockKey);

        return Response.json({
          route: {
            key: matchedRoute.key,
            inbound,
            outbound,
          },
          lastUpdated: queryTime.toISOString(),
          nextUpdate: nextUpdate.toISOString(),
        } satisfies Traffic.RouteResponse);
      },
    },
  },
});
