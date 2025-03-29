import { dayjs, getDate } from "~/utils/dayjs";

export type TrafficStatus = "unknown" | "clear" | "delayed" | "slow";

export function determineTrafficStatus(duration?: number, durationInTraffic?: number): TrafficStatus {
  if (!duration || !durationInTraffic) return "unknown";

  const difference = durationInTraffic - duration;

  if (difference >= 60 * 10) return "slow";
  if (difference >= 60 * 2) return "delayed";

  return "clear";
}

export function determineIsPeakTraffic() {
  const currentHour = getDate().hour();
  const isMorning = currentHour >= 5 && currentHour < 10;
  const isAfternoon = currentHour >= 15 && currentHour < 20;

  return isMorning || isAfternoon;
}

export function determineIsOffHours() {
  const currentHour = getDate().hour();

  return currentHour >= 0 && currentHour < 5;
}

export function determineNextTrafficUpdate(route: RouteResponse): dayjs.Dayjs {
  if (determineIsOffHours()) {
    return getDate().add(15, "minutes");
  }

  const hasDelay = [route.outbound, route.inbound].some((segment) => {
    const status = determineTrafficStatus(segment.duration, segment.duration_in_traffic);

    return status === "delayed" || status === "slow";
  });

  if (hasDelay || determineIsPeakTraffic()) {
    return getDate().add(5, "minutes");
  }

  return getDate().add(10, "minutes");
}
