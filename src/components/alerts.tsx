import { ReactNode } from "react";
import { ExclamationTriangleIcon, NoSymbolIcon } from "@heroicons/react/20/solid";
import { SEVERITY_MAJOR_CLASSES } from "~/constants/styles";
import classNames from "classnames";
import useSWR from "swr";
import AccidentIcon from "~/assets/accident.svg?react";
import RoadIcon from "~/assets/road.svg?react";
import ConeIcon from "~/assets/cone.svg?react";
import lodash from "lodash";

const { startCase } = lodash;

export const Alerts = () => {
  return (
    <section id="alerts" className="mb-6">
      <h2 className="flex items-center text-xl font-semibold leading-6 text-slate-900 dark:text-slate-100">
        <span>Traffic Alerts</span>
      </h2>

      <p className="mb-4 mt-1 text-xs text-slate-500">Alerts are updated every 10 minutes</p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AlertsList />
      </div>
    </section>
  );
};

function AlertsList() {
  const { data, isLoading } = useSWR<AlertsResponse>("/api/alerts", {
    refreshInterval: 10 * 60 * 1_000,
  });

  if (isLoading || !data) {
    return (
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
    );
  }

  if (data.alerts.length === 0) {
    return (
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
    );
  }

  return data.alerts.map((alert) => {
    let icon: ReactNode;
    let severity: string;

    switch (alert.severity) {
      case "major":
        severity = SEVERITY_MAJOR_CLASSES;
        break;
      case "minor":
      default:
        severity = "ring-1 ring-inset ring-slate-200 dark:ring-slate-700 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-white";
    }

    switch (alert.type) {
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

    const href = `https://az511.com/Event/Incidents/${alert.alertId}`;

    return (
      <div className={classNames("rounded-md p-4", severity)} key={alert.alertId}>
        <div className="flex">
          <div className="flex-shrink-0">{icon}</div>

          <div className="ml-3">
            <p className="text-sm">
              <strong className={"mb-1 inline-block text-base"}>{startCase(alert.type)}</strong>
              <br />
              {alert.description}
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
  });
}
