import TrafficSign from "~/components/TrafficSign";
import { ROUTES } from "~/constants/routes";
import useSWR from "swr";
import { swrFetcher } from "~/utils/swr";
import { useContext } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { appContext } from "~/utils/context";

dayjs.extend(isSameOrAfter);

export default function TrafficView({ isAfternoon }: { isAfternoon: boolean }) {
  const { appVersion } = useContext(appContext);

  const { data } = useSWR<WithAppVersion<TrafficResponse>>(`/api/traffic/347`, {
    fetcher: swrFetcher,
    revalidateOnFocus: false,
    refreshWhenHidden: false,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    refreshInterval: (data) => {
      if (!data) return 60_000;

      const lastUpdated = dayjs(data.lastUpdated);
      const expirationDate = dayjs(lastUpdated).add(5, "minutes");
      const msUntilStale = expirationDate.diff();
      const refreshInterval = Math.max(30_000, msUntilStale);

      console.log(`refreshInterval: ${refreshInterval / 1_000}s`);

      return refreshInterval;
    },
    onSuccess: (data) => {
      if (!!appVersion && !!data.appVersion && data.appVersion !== appVersion) {
        window.location.reload();
      }
    },
  });

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
