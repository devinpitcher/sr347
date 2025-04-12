import TrafficSign from "~/components/TrafficSign";
import { ROUTES } from "~/constants/routes";
import useSWR from "swr";
import { useContext, useMemo } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { AppContext } from "~/utils/context";
import { useSWRFetcher } from "~/utils/swr";
import { determineTrafficStatus } from "~/utils/traffic";
import { ClickTap } from "~/components/utils";
import { Traffic } from "~/types/traffic";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useLocalStorageState } from "ahooks";

dayjs.extend(isSameOrAfter);

export default function TrafficView({ isAfternoon }: { isAfternoon: boolean }) {
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
      if (!!appVersion && !!data.appVersion && data.appVersion !== appVersion) {
        window.location.reload();
      }
    },
  });

  const hasBackup = useMemo(() => {
    if (!data) return false;

    return [data.route.inbound, data.route.outbound].some((route) => {
      const status = determineTrafficStatus(route.duration, route.duration_in_traffic);

      return status === "slow" || status === "delayed";
    });
  }, [data]);

  return (
    <div>
      <div>
        <p className={"text-balance py-3 text-center text-xs"}>
          ✨ <strong>New!</strong> ✨ Select your neighborhood to get more accurate travel times for <span className={"font-bold italic"}>your</span> commute!
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

        {hasBackup && (
          <div className="order-3 rounded-md border-2 border-red-200 bg-gradient-to-t from-white to-red-200 p-4 dark:border-red-950 dark:from-black dark:to-red-950">
            <div className="flex">
              <div className="text-red-950 dark:text-white">
                <h3 className="inline-flex items-center gap-2 text-lg font-bold">
                  <span className="animate-h-shake text-3xl">🤬</span> Tired of sitting in traffic?
                </h3>

                <div className="mt-2 text-sm">
                  <p className={"leading-relaxed"}>
                    Tell your Arizona state officials, ADOT board members, and Pinal County supervisors <strong>enough is enough!</strong> Help us demand action
                    and funding to make this road safer for everyone:{" "}
                    <strong className={"border-b border-current italic text-red-600"}>send them an email now and make your voice heard.</strong>
                  </p>
                </div>

                <div className="mt-4 flex flex-col items-center gap-4">
                  <a
                    href="https://347facts.com/contact?ref=sr347.com"
                    data-umami-event="347facts-click"
                    data-umami-event-url="https://347facts.com/contact?ref=sr347.com"
                    data-umami-event-position="traffic"
                    className="w-full animate-pulse rounded-md bg-red-700 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                  >
                    <ClickTap /> here to send an email now!
                  </a>

                  <a
                    href="https://347facts.com?ref=sr347.com"
                    data-umami-event="347facts-click"
                    data-umami-event-url="https://347facts.com?ref=sr347.com"
                    data-umami-event-position="traffic"
                    className="w-full rounded-md bg-slate-800/10 px-3.5 py-2.5 text-center text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-800/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
                  >
                    <ClickTap /> here to visit 347Facts.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
