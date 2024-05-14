import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { ROUTES } from "~/constants/routes";
import { type DistanceMatrixResponseData } from "@googlemaps/google-maps-services-js";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const {
    env: { KV },
  } = context.cloudflare;
  const matchedRoute = ROUTES.find(({ key }) => key.toLowerCase() === params.route!.toLowerCase());

  if (!matchedRoute) {
    return new Response(null, {
      status: 404,
      statusText: "Route not found",
    });
  }

  const key = `route-${matchedRoute.key}`;

  const value = await KV.get(key);

  if (value !== null) {
    return Response.json(JSON.parse(value));
  }

  const trafficResponse = await computeTraffic(matchedRoute, context.cloudflare.env.MAPS_API_KEY);

  await KV.put(key, JSON.stringify(trafficResponse), {
    expirationTtl: 60 * 5,
  });

  return Response.json(trafficResponse);
};

async function computeTraffic(route: Route, apiKey: string) {
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

  return {
    route: {
      key: route.key,
      outbound: {
        duration: results[0].rows[0].elements[0].duration.value,
        duration_in_traffic: results[0].rows[0].elements[0].duration_in_traffic.value,
      },
      inbound: {
        duration: results[1].rows[0].elements[0].duration.value,
        duration_in_traffic: results[1].rows[0].elements[0].duration_in_traffic.value,
      },
    },
    lastUpdated: now.toUTCString(),
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
