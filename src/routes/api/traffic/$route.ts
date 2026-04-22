import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { Redis } from "@upstash/redis/cloudflare";
import { dayjs } from "~/lib/dayjs";
import { ROUTES } from "~/constants/routes";
import { Traffic } from "~/types/traffic";
import { TomTomService } from "~/services/tomtom";
import { db } from "~/database/client";
import { trafficTable } from "~/database/schema";
import { avg, and, between, desc, eq } from "drizzle-orm";

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
                typical_duration: currentValue.inboundTypicalDuration ?? currentValue.inboundDuration,
                duration_in_traffic: currentValue.inboundDurationInTraffic,
                typical_duration_in_traffic: currentValue.inboundTypicalDurationInTraffic ?? currentValue.inboundDurationInTraffic,
              },
              outbound: {
                duration: currentValue.outboundDuration,
                typical_duration: currentValue.outboundTypicalDuration ?? currentValue.outboundDuration,
                duration_in_traffic: currentValue.outboundDurationInTraffic,
                typical_duration_in_traffic: currentValue.outboundTypicalDurationInTraffic ?? currentValue.outboundDurationInTraffic,
              },
            },
            lastUpdated: currentValue.queryTimestamp.toISOString(),
            nextUpdate: currentValue.nextUpdate.toISOString(),
            cached: true,
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
        const dayOfWeek = queryTime.day();
        const timeOfDay = queryTime.diff(queryTime.startOf("day"), "seconds");
        const nextUpdate = queryTime.clone().add(5, "minutes");

        const sq = db
          .select({
            inboundDuration: trafficTable.inboundDuration,
            inboundDurationInTraffic: trafficTable.inboundDurationInTraffic,
            outboundDuration: trafficTable.outboundDuration,
            outboundDurationInTraffic: trafficTable.outboundDurationInTraffic,
          })
          .from(trafficTable)
          .where(
            and(
              eq(trafficTable.routeId, matchedRoute.key),
              eq(trafficTable.dayOfWeek, dayOfWeek),
              between(trafficTable.timeOfDay, timeOfDay - 900, timeOfDay + 900)
            )
          )
          .orderBy(desc(trafficTable.id))
          .limit(50)
          .as("sq");

        const [historical] = await db
          .select({
            inboundDuration: avg(sq.inboundDuration),
            inboundDurationInTraffic: avg(sq.inboundDurationInTraffic),
            outboundDuration: avg(sq.outboundDuration),
            outboundDurationInTraffic: avg(sq.outboundDurationInTraffic),
          })
          .from(sq);

        const inbound = await tomtom.getRoute({
          origin: matchedRoute.inbound.origin.join(","),
          destination: matchedRoute.inbound.destination.join(","),
        });

        const outbound = await tomtom.getRoute({
          origin: matchedRoute.outbound.origin.join(","),
          destination: matchedRoute.outbound.destination.join(","),
        });

        const inboundDuration = inbound.duration;
        const inboundTypicalDuration = Math.round(Number(historical?.inboundDuration ?? inbound.duration));
        const inboundDurationInTraffic = inbound.duration_in_traffic;
        const inboundTypicalDurationInTraffic = Math.round(Number(historical?.inboundDurationInTraffic ?? inbound.duration_in_traffic));
        const outboundDuration = outbound.duration;
        const outboundTypicalDuration = Math.round(Number(historical?.outboundDuration ?? outbound.duration));
        const outboundDurationInTraffic = outbound.duration_in_traffic;
        const outboundTypicalDurationInTraffic = Math.round(Number(historical?.outboundDurationInTraffic ?? outbound.duration_in_traffic));

        await db.insert(trafficTable).values({
          routeId: matchedRoute.key,
          inboundDuration,
          inboundTypicalDuration,
          inboundDurationInTraffic,
          inboundTypicalDurationInTraffic,
          outboundDuration,
          outboundTypicalDuration,
          outboundDurationInTraffic,
          outboundTypicalDurationInTraffic,
          dayOfWeek,
          timeOfDay,
          queryTimestamp: queryTime.toDate(),
          nextUpdate: nextUpdate.toDate(),
        });

        await redis.del(lockKey);

        return Response.json({
          route: {
            key: matchedRoute.key,
            inbound: {
              duration: inboundDuration,
              typical_duration: inboundTypicalDuration,
              duration_in_traffic: inboundDurationInTraffic,
              typical_duration_in_traffic: inboundTypicalDurationInTraffic,
            },
            outbound: {
              duration: outboundDuration,
              typical_duration: outboundTypicalDuration,
              duration_in_traffic: outboundDurationInTraffic,
              typical_duration_in_traffic: outboundTypicalDurationInTraffic,
            },
          },
          lastUpdated: queryTime.toISOString(),
          nextUpdate: nextUpdate.toISOString(),
          cached: false,
        } satisfies Traffic.RouteResponse);
      },
    },
  },
});
