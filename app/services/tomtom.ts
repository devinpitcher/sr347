import { TomTom } from "~/types/tomtom";
import { Traffic } from "~/types/traffic";

export class TomTomService {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async getRoute(origin: string, destination: string): Promise<Traffic.RouteTraffic> {
    const requestUrl = new URL(`https://api.tomtom.com/routing/1/calculateRoute/${origin}:${destination}/json`);

    requestUrl.searchParams.set("key", this.apiKey);
    requestUrl.searchParams.set("routeType", "fastest");
    requestUrl.searchParams.set("traffic", "true");
    requestUrl.searchParams.set("computeTravelTimeFor", "all");

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Accept-Encoding": "gzip, deflate", // TomTom does not accept brotli (br)
      },
    });

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

    const duration = route.summary.travelTimeInSeconds - route.summary.trafficDelayInSeconds;
    const duration_in_traffic = route.summary.liveTrafficIncidentsTravelTimeInSeconds;

    return {
      duration,
      duration_in_traffic: duration_in_traffic ?? duration,
    };
  }
}
