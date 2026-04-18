import useSWR from "swr";
import { UmamiRealtimeResponse } from "~/types/umami";

export function Realtime() {
  const { data, isLoading, error } = useSWR<UmamiRealtimeResponse>("/api/realtime", {
    refreshInterval: 60 * 1_000,
  });

  if (isLoading || error || !data) return null;

  const { visitors } = data;

  const noun = visitors === 1 ? "person" : "people";

  return (
    <div className={"flex items-center justify-center gap-1 text-xs sm:absolute sm:right-5"}>
      <div className={"size-2 animate-pulse rounded-full bg-green-600"}></div> {visitors} {noun} here
    </div>
  );
}
