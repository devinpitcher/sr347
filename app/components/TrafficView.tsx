import TrafficSign from "~/components/TrafficSign";
import { ROUTES } from "~/constants/routes";
import useSWR from "swr";
import { swrFetcher } from "~/utils/swr";
import { useEffect } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);

export default function TrafficView({ isAfternoon }: { isAfternoon: boolean }) {
  const { data, mutate } = useSWR<TrafficResponse>(`/api/traffic/347`, {
    fetcher: swrFetcher,
  });

  useEffect(() => {
    if (data?.lastUpdated) {
      const lastUpdated = dayjs(data.lastUpdated);

      let timeout: NodeJS.Timeout | null = null;
      let interval: NodeJS.Timeout | null = null;

      const firstRefreshMs = Math.max(0, dayjs(lastUpdated).add(5, "minutes").subtract(15, "seconds").diff());

      timeout = setTimeout(() => {
        if (dayjs().isSameOrAfter(lastUpdated)) {
          interval = setInterval(() => {
            mutate();
          }, 15 * 1000);
        }
      }, firstRefreshMs);

      return () => {
        if (interval) clearInterval(interval);
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [data]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 sm:space-y-0 lg:grid-cols-1">
        <TrafficSign
          name={`Northbound ${ROUTES[0].key}`}
          description={ROUTES[0].outbound.description}
          duration={data?.route.outbound.duration}
          durationInTraffic={data?.route.outbound.duration_in_traffic}
          lastUpdated={data?.lastUpdated}
          className={isAfternoon ? "order-2" : "order-1"}
        />

        <TrafficSign
          name={`Southbound ${ROUTES[0].key}`}
          description={ROUTES[0].inbound.description}
          duration={data?.route.inbound.duration}
          durationInTraffic={data?.route.inbound.duration_in_traffic}
          lastUpdated={data?.lastUpdated}
          className={isAfternoon ? "order-1" : "order-2"}
        />
      </div>

      <div className="mb-6">
        <div className="mb-4 rounded-md bg-slate-400/10 p-4 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-400/20">
          <p className="mb-2">
            <strong>✨ New feature coming soon! ✨</strong>
          </p>
          <p>Soon you&apos;ll be able to choose a custom route to get a better traffic estimate to and from your neighborhood.</p>
        </div>
      </div>
    </div>
  );
}
