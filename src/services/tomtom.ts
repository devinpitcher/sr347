import { TomTom } from "~/types/tomtom";

export class TomTomService {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async getRoute({ origin, destination }: { origin: string; destination: string }) {
    const requestUrl = new URL(`https://api.tomtom.com/routing/1/calculateRoute/${origin}:${destination}/json`);

    requestUrl.searchParams.set("key", this.apiKey);
    requestUrl.searchParams.set("routeType", "fastest");
    requestUrl.searchParams.set("traffic", "true");
    requestUrl.searchParams.set("computeTravelTimeFor", "all");

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 5_000);

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Accept-Encoding": "gzip, deflate", // TomTom does not accept brotli (br)
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();
      console.error(text, response);
      throw new Error("Failed to fetch route");
    }

    const data = (await response.json()) as TomTom.RouteResponse;

    if (data.routes.length === 0) {
      throw new Error("No route found");
    }

    const [route] = data.routes;

    const duration = route.summary.noTrafficTravelTimeInSeconds;
    const duration_in_traffic = route.summary.liveTrafficIncidentsTravelTimeInSeconds ?? route.summary.noTrafficTravelTimeInSeconds;

    return {
      duration,
      duration_in_traffic,
    };
  }
}
