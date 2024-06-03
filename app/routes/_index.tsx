import type { MetaFunction } from "@remix-run/cloudflare";
import { CAMERAS } from "~/constants/cameras";
import Camera from "~/components/Camera";
import TrafficView from "~/components/TrafficView";
import { HeartIcon, ExclamationTriangleIcon, NoSymbolIcon } from "@heroicons/react/20/solid";
import { Fragment, ReactNode } from "react";
import { Popover, Transition } from "@headlessui/react";
import SR347Logo from "~/assets/sr347.svg?react";
import AccidentIcon from "~/assets/accident.svg?react";
import RoadIcon from "~/assets/road.svg?react";
import ConeIcon from "~/assets/cone.svg?react";
import classNames from "classnames";
import lodash from "lodash";
import useSWR from "swr";
import { swrFetcher } from "~/utils/swr";
import Banner from "~/components/Banner";

const { startCase } = lodash;

export const meta: MetaFunction = () => {
  return [
    { title: "SR347.com" },
    {
      name: "description",
      content: "Check the traffic before you leave! Travel times, live cameras, and ADOT alerts, all in one place.",
    },
  ];
};

export default function Home() {
  const isAfternoon = new Date().getHours() >= 12;

  const { data: alertsData, isLoading } = useSWR<Alert[]>("/api/alerts?v=2", {
    fetcher: swrFetcher,
    revalidateOnFocus: true,
    refreshWhenHidden: false,
    revalidateIfStale: false,
    refreshInterval: 10 * 60 * 1000,
  });

  const alerts = alertsData || [];

  return (
    <section>
      <Banner />

      <nav className="mx-auto flex flex-row items-center justify-center bg-slate-200 p-4 dark:bg-slate-700">
        <span className="mr-1 mt-1 text-lg font-semibold">SR</span>
        <span className="sr-only">347</span>
        <SR347Logo width={40} />
      </nav>

      <main className="mx-auto flex max-w-[1600px] flex-col p-5 lg:flex-row lg:gap-x-8 lg:p-8">
        <section id="live-traffic" className="mb-8 lg:order-2 lg:mb-0">
          <div className="lg:w-72 xl:w-80">
            <div className="border-b border-gray-200 pb-5 dark:border-slate-700">
              <h2 className="flex items-center text-xl font-semibold leading-6 text-slate-900 dark:text-slate-100">
                <span className="mr-1 animate-pulse rounded bg-red-700 px-2 py-0.5 text-sm text-white">Live</span>&nbsp;<span>Traffic</span>
              </h2>
              <p className="mt-1 text-xs text-slate-500">Traffic updates every 5 minutes</p>
            </div>

            <TrafficView isAfternoon={isAfternoon} />

            <p className="text-center text-xs text-slate-500">Live traffic data provided by Google Maps</p>
          </div>
        </section>

        <section className="w-full lg:order-1">
          <section id="alerts" className="mb-6">
            <h2 className="flex items-center text-xl font-semibold leading-6 text-slate-900 dark:text-slate-100">
              <span>Traffic Alerts</span>&nbsp;<span className="ml-1 rounded bg-red-700 px-2 py-0.5 text-sm text-white">Beta</span>
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
                        <strong className={"mb-1 inline-block text-base"}>Loading current traffic alerts...</strong>
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
                        <strong className={"mb-1 inline-block text-base"}>All clear!</strong>
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

                  const [org, id] = alert.ID.split("--");

                  switch (alert.Severity) {
                    case "major":
                      severity = "ring-1 ring-inset ring-red-300 dark:ring-red-800 bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200";
                      break;
                    case "minor":
                    default:
                      severity = "ring-1 ring-inset ring-slate-200 dark:ring-slate-700 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-white";
                  }

                  switch (alert.EventType) {
                    case "accidentsAndIncidents":
                      icon = <AccidentIcon className="size-6" aria-hidden="true" />;
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
                            <a href={`https://az511.com/EventDetails/${org}/${id}?lang=en`} target={"_blank"} rel="noreferrer" className={"underline"}>
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

          <section id="live-cameras">
            <div className="border-b border-gray-200 pb-5 dark:border-slate-700">
              <h2 className="flex items-center text-xl font-semibold leading-6 text-slate-900 dark:text-slate-100">
                <span className="mr-1 animate-pulse rounded bg-red-700 px-2 py-0.5 text-sm text-white">Live</span>&nbsp;<span>Cameras</span>
              </h2>
              <p className="mt-1 text-xs text-slate-500">Cameras update every 15 seconds</p>
            </div>

            <div className="grid grid-cols-1 gap-y-4 py-4 lg:grid-cols-2 lg:gap-x-4">
              {CAMERAS.map((camera, index) => (
                <div
                  style={{
                    order: index * (isAfternoon ? 1 : -1) + 1,
                  }}
                  key={camera.id}
                >
                  <Camera {...camera} />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 dark:border-slate-700">
              <p className="text-center text-sm text-slate-500">
                Live traffic cameras and alerts are provided by{" "}
                <a href="https://az511.com" target="_blank" className="underline" rel="noreferrer">
                  ADOT
                </a>
                .
                <br />
                We cannot control or guarantee the positioning of the views or availability of these cameras.
              </p>
            </div>
          </section>
        </section>
      </main>

      <footer className="relative isolate mt-4 overflow-hidden bg-slate-900 sm:mt-6 lg:mt-12">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-bold tracking-tight text-white sm:text-4xl">👋 Hi there! Thanks for stopping by.</h2>

            <p className="mx-auto mt-6 text-lg leading-8 text-gray-300">
              This website is created and maintained by{" "}
              <a href="https://devinpitcher.com?ref=sr347.com" className="underline" target="_blank">
                a fellow Maricopan / software engineer
              </a>{" "}
              trying to make commuting the 347 a little less stressful. If you find this website useful, please consider a small donation. Integrating Google
              Maps functionality into this website isn&apos;t completely free, but I&apos;d like to provide this service to people at no cost. If you have the
              means, your donation help offset the cost of running this service and further development. Thank you!
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Popover className="relative">
                <Popover.Button className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-red-700 shadow-sm hover:bg-gray-100 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  <HeartIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" /> Donate
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute bottom-[calc(100%_+_10px)] left-1/2 z-10 mt-5 flex w-screen max-w-min -translate-x-1/2 px-4">
                    <div className="w-48 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
                      {[
                        { name: "PayPal", href: "https://www.paypal.me/DevinPitcher" },
                        {
                          name: "Venmo",
                          href: "https://venmo.com/u/devin_pitcher",
                        },
                        {
                          name: "CashApp",
                          href: "https://cash.app/$devinpitcher",
                        },
                      ].map((item) => (
                        <a key={item.name} href={item.href} className="block p-2 hover:text-indigo-600" target="_blank" rel="noreferrer">
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            </div>
          </div>
        </div>

        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[100rem] w-[100rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          aria-hidden="true"
        >
          <circle cx={512} cy={512} r={512} fill="url(#8d958450-c69f-4251-94bc-4e091a323369)" fillOpacity="0.7" />
          <defs>
            <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
              <stop stopColor="#7775D6" />
              <stop offset={1} stopColor="#E935C1" />
            </radialGradient>
          </defs>
        </svg>
      </footer>
    </section>
  );
}
