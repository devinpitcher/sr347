export type TrafficStatus = "unknown" | "clear" | "delayed" | "slow";

export function determineTrafficStatus(duration?: number, durationInTraffic?: number): TrafficStatus {
  if (!duration || !durationInTraffic) return "unknown";

  const difference = durationInTraffic - duration;

  if (difference >= 60 * 10) return "slow";
  if (difference >= 60 * 2) return "delayed";

  return "clear";
}
