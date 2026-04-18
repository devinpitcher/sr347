import { TrafficSign } from "~/components/traffic-sign";
import { ROUTES } from "~/constants/routes";
import useSWR from "swr";
import { useContext, useMemo } from "react";
import { Traffic } from "~/types/traffic";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useLocalStorageState } from "ahooks";
import { AppContext } from "~/context";
import { useSWRFetcher } from "~/lib/swr";
import { APP_VERSION_HEADER } from "~/constants/app";
import { dayjs } from "~/lib/dayjs";

export function TrafficView({ isAfternoon }: { isAfternoon: boolean }) {
  const { appVersion } = useContext(AppContext);
  const fetcher = useSWRFetcher();

  const [userRoute, setUserRoute] = useLocalStorageState("selected-route", {
    defaultValue: "347",
  });

  const selectedRoute = useMemo(() => {
    const match = ROUTES.find((route) => route.key === userRoute);

    if (match) return match;

    return ROUTES.find((route) => route.key === "347")!;
  }, [userRoute]);

  const { data } = useSWR<WithAppVersion<Traffic.RouteResponse>>(`/api/traffic/${selectedRoute.key}`, {
    fetcher: async (url: string) => {
      const response = await fetcher(url);

      return (await response.json()) as Traffic.RouteResponse;
    },
    refreshInterval: (data) => {
      if (!data) return 60_000;

      const lastUpdated = dayjs(data.lastUpdated);
      const expirationDate = dayjs(lastUpdated).add(5, "minutes");
      const msUntilStale = expirationDate.diff();
      const refreshInterval = Math.max(5_000, msUntilStale);

      console.log(`refreshInterval: ${refreshInterval / 1_000}s`);

      return refreshInterval;
    },
    onSuccess: (data) => {
      if (!!appVersion && !!data[APP_VERSION_HEADER] && data[APP_VERSION_HEADER] !== appVersion) {
        window.location.reload();
      }
    },
  });

  return (
    <div>
      <div>
        <p className={"text-balance py-3 text-xs"}>
          Select your neighborhood to get more accurate travel times for <span className={"font-bold italic"}>your</span> commute:
        </p>

        <div className="grid grid-cols-1">
          <select
            id="location"
            name="location"
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-slate-800 dark:text-white dark:outline-slate-700"
            value={selectedRoute.key}
            onChange={(e) => setUserRoute(e.currentTarget.value)}
          >
            {ROUTES.map((route) => (
              <option key={route.key} value={route.key}>
                {route.name}
              </option>
            ))}
          </select>

          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 sm:space-y-0 lg:grid-cols-1">
        <TrafficSign
          name={`Northbound 347`}
          description={selectedRoute.outbound.description}
          duration={data?.route.outbound.duration}
          durationInTraffic={data?.route.outbound.duration_in_traffic}
          lastUpdated={data?.lastUpdated}
          className={isAfternoon ? "order-2" : "order-1"}
        />

        <TrafficSign
          name={`Southbound 347`}
          description={selectedRoute.inbound.description}
          duration={data?.route.inbound.duration}
          durationInTraffic={data?.route.inbound.duration_in_traffic}
          lastUpdated={data?.lastUpdated}
          className={isAfternoon ? "order-1" : "order-2"}
        />
      </div>
    </div>
  );
}
