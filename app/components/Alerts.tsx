import { ReactNode } from "react";
import { ExclamationTriangleIcon, NoSymbolIcon } from "@heroicons/react/20/solid";
import { SEVERITY_MAJOR_CLASSES } from "~/constants/styles";
import classNames from "classnames";
import useSWR from "swr";
import AccidentIcon from "~/assets/accident.svg?react";
import RoadIcon from "~/assets/road.svg?react";
import ConeIcon from "~/assets/cone.svg?react";
import lodash from "lodash";
import { useSWRFetcher } from "~/utils/swr";

const { startCase } = lodash;

export const Alerts = () => {
  const fetcher = useSWRFetcher();

  const { data: alertsData, isLoading } = useSWR<Alert[]>("/api/alerts", {
    refreshInterval: 10 * 60 * 1_000,
    fetcher: async (url: string) => {
      const response = await fetcher(url);

      return (await response.json()) as Alert[];
    },
  });

  const alerts = alertsData || [];

  return (
    <section id="alerts" className="mb-6">
      <h2 className="flex items-center text-xl font-semibold leading-6 text-slate-900 dark:text-slate-100">
        <span>Traffic Alerts</span>
      </h2>

      <p className="mb-4 mt-1 text-xs text-slate-500">Alerts are updated every 10 minutes</p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {isLoading && (
          <div className="rounded-md bg-slate-100 p-4 text-slate-800 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <RoadIcon className="size-6" aria-hidden="true" />
              </div>

              <div className="ml-3">
                <p className="text-sm">
                  <strong className={"inline-block text-base"}>Loading current traffic alerts...</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && alerts && alerts.length === 0 && (
          <div className="rounded-md bg-green-100 p-4 text-green-800 ring-1 ring-inset ring-green-200 dark:bg-green-900 dark:text-green-200 dark:ring-green-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <RoadIcon className="size-6" aria-hidden="true" />
              </div>

              <div className="ml-3">
                <p className="text-sm">
                  <strong className={"inline-block text-base"}>No reported incidents. Drive safe!</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {alerts === null && (
          <div className="rounded-md bg-slate-100 p-4 text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="mt-1 size-5" aria-hidden="true" />
              </div>

              <div className="ml-3">
                <p className="text-base">Alerts are unavailable right now</p>
              </div>
            </div>
          </div>
        )}

        {alerts &&
          alerts.map((alert) => {
            let icon: ReactNode;
            let severity: string;

            switch (alert.Severity) {
              case "major":
                severity = SEVERITY_MAJOR_CLASSES;
                break;
              case "minor":
              default:
                severity = "ring-1 ring-inset ring-slate-200 dark:ring-slate-700 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-white";
            }

            switch (alert.EventType) {
              case "accidentsAndIncidents":
                icon = <AccidentIcon className="size-6" aria-hidden="true" />;
                severity = SEVERITY_MAJOR_CLASSES;
                break;
              case "closures":
                icon = <NoSymbolIcon className="size-5" aria-hidden="true" />;
                break;
              case "roadwork":
                icon = <ConeIcon className="mt-0.5 size-5" aria-hidden="true" />;
                break;
              default:
                icon = <ExclamationTriangleIcon className="size-5" aria-hidden="true" />;
            }

            const href = `https://az511.com/Event/Incidents/${alert.ID}`;

            return (
              <div className={classNames("rounded-md p-4", severity)} key={alert.ID}>
                <div className="flex">
                  <div className="flex-shrink-0">{icon}</div>

                  <div className="ml-3">
                    <p className="text-sm">
                      <strong className={"mb-1 inline-block text-base"}>{startCase(alert.EventType)}</strong>
                      <br />
                      {alert.Description}
                    </p>
                    <p className={"mt-2 text-sm font-bold"}>
                      <a href={href} target={"_blank"} rel="noreferrer" className={"underline"} data-umami-event="alert-click" data-umami-event-url={href}>
                        More info
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};
