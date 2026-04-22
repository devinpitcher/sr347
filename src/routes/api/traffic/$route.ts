import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { Redis } from "@upstash/redis/cloudflare";
import { dayjs } from "~/lib/dayjs";
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
                historical_duration_in_traffic: currentValue.inboundHistoricalDurationInTraffic || currentValue.inboundDurationInTraffic,
                traffic_delay: currentValue.inboundTrafficDelay ?? 0,
              },
              outbound: {
                duration: currentValue.outboundDuration,
                duration_in_traffic: currentValue.outboundDurationInTraffic,
                historical_duration_in_traffic: currentValue.outboundHistoricalDurationInTraffic || currentValue.outboundDurationInTraffic,
                traffic_delay: currentValue.outboundTrafficDelay ?? 0,
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
        });

        const outbound = await tomtom.getRoute({
          origin: matchedRoute.outbound.origin.join(","),
          destination: matchedRoute.outbound.destination.join(","),
        });

        await db.insert(trafficTable).values({
          routeId: matchedRoute.key,
          inboundDuration: inbound.freeflowTravelTime,
          inboundDurationInTraffic: inbound.liveTravelTime,
          inboundHistoricalDurationInTraffic: inbound.historicalTravelTime,
          inboundTrafficDelay: inbound.trafficDelay,
          outboundDuration: outbound.freeflowTravelTime,
          outboundDurationInTraffic: outbound.liveTravelTime,
          outboundHistoricalDurationInTraffic: outbound.historicalTravelTime,
          outboundTrafficDelay: outbound.trafficDelay,
          dayOfWeek: queryTime.day(),
          timeOfDay: queryTime.diff(queryTime.startOf("day"), "seconds"),
          queryTimestamp: queryTime.toDate(),
          nextUpdate: nextUpdate.toDate(),
        });

        await redis.del(lockKey);

        return Response.json({
          route: {
            key: matchedRoute.key,
            inbound: {
              duration: inbound.freeflowTravelTime,
              duration_in_traffic: inbound.liveTravelTime,
              historical_duration_in_traffic: inbound.historicalTravelTime,
              traffic_delay: inbound.trafficDelay,
            },
            outbound: {
              duration: outbound.freeflowTravelTime,
              duration_in_traffic: outbound.liveTravelTime,
              historical_duration_in_traffic: outbound.historicalTravelTime,
              traffic_delay: outbound.trafficDelay,
            },
          },
          lastUpdated: queryTime.toISOString(),
          nextUpdate: nextUpdate.toISOString(),
        } satisfies Traffic.RouteResponse);
      },
    },
  },
});
