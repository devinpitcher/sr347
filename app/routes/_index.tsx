import { MetaFunction } from "@remix-run/cloudflare";
import { CAMERAS } from "~/constants/cameras";
import Camera from "~/components/Camera";
import TrafficView from "~/components/TrafficView";
import { HeartIcon } from "@heroicons/react/20/solid";
import { Fragment, useContext, useEffect, useRef } from "react";
import { Popover, Transition } from "@headlessui/react";
import SR347Logo from "~/assets/sr347.svg?react";
import Banner from "~/components/Banner";
import { AppContext } from "~/utils/context";
import useTabVisibility from "~/utils/hooks/useTabVisibility";
import { trackPage } from "~/utils/umami";
import { Alerts } from "~/components/Alerts";

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
  const { appVersion } = useContext(AppContext);
  const isAfternoon = new Date().getHours() >= 12;
  const appVisible = useTabVisibility();
  const lastVisibleRef = useRef<number>();

  useEffect(() => {
    if (appVisible) {
      if (!lastVisibleRef.current) {
        console.log("Welcome!");
        lastVisibleRef.current = Date.now();
      } else if (Date.now() - lastVisibleRef.current >= 1_000 * 60 * 5) {
        console.log("Welcome back!");
        trackPage();
      } else {
        console.log("Back so soon?");
      }

      return () => {
        lastVisibleRef.current = Date.now();
      };
    }

    console.log("See you later!");
  }, [appVisible]);

  const sortedCameras = [...CAMERAS];

  if (!isAfternoon) {
    sortedCameras.reverse();
  }

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
                <span className="mr-1 animate-pulse rounded bg-red-700 px-2 py-0.5 text-sm text-white">Live</span>&nbsp;
                <span>Traffic</span>
              </h2>
              <p className="mt-1 text-xs text-slate-500">Traffic updates every 5 minutes</p>
            </div>

            <TrafficView isAfternoon={isAfternoon} />

            <p className="text-center text-xs text-slate-500">Live traffic data provided by Google Maps</p>
          </div>
        </section>

        <section className="w-full lg:order-1">
          <Alerts />

          <section id="live-cameras">
            <div className="border-b border-gray-200 pb-5 dark:border-slate-700">
              <h2 className="flex items-center text-xl font-semibold leading-6 text-slate-900 dark:text-slate-100">
                <span className="mr-1 animate-pulse rounded bg-red-700 px-2 py-0.5 text-sm text-white">Live</span>&nbsp;
                <span>Cameras</span>
              </h2>
              <p className="mt-1 text-xs text-slate-500">Cameras update every 15 seconds</p>
            </div>

            <div className="grid grid-cols-1 gap-y-4 py-4 lg:grid-cols-2 lg:gap-x-4">
              {sortedCameras.map((camera) => (
                <Camera {...camera} key={camera.id} />
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

              <p className="mt-2 text-center font-mono text-xs text-slate-300 dark:text-slate-800">
                <strong>App version:</strong> {appVersion?.slice(-7)}
              </p>
            </div>
          </section>
        </section>
      </main>

      <section>
        <div className="relative bg-slate-100 dark:bg-slate-950">
          <div className="relative h-80 overflow-hidden bg-slate-600 md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2">
            <img src="https://cdn.sr347.com/347-accident.jpg" className="size-full object-cover mix-blend-overlay grayscale" />
          </div>

          <div className="sm:py-18 relative mx-auto max-w-7xl py-12 lg:px-8 lg:py-40">
            <div className="pl-6 pr-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32">
              <h2 className="text-base/7 font-semibold text-slate-400">Demand Immediate Action!</h2>

              <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-800 sm:text-5xl dark:text-white">✊ Join the Fight for Safer Roads</p>

              <p className="mt-6 text-lg/8 text-slate-700 dark:text-gray-300">
                Tell your Arizona state officials, ADOT board members, and Pinal County supervisors <span className="font-bold italic">enough is enough!</span>{" "}
                Help us demand action and funding to make this road safer for everyone: send them an email now and make your voice heard.
              </p>

              <div className="mt-8 space-x-4">
                <a
                  href="https://347facts.com/contact?ref=sr347.com"
                  data-umami-event="347facts-click"
                  data-umami-event-url="https://347facts.com/contact?ref=sr347.com"
                  data-umami-event-position="footer"
                  className="rounded-md bg-red-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                >
                  Send an email now!
                </a>

                <a
                  href="https://347facts.com?ref=sr347.com"
                  data-umami-event="347facts-click"
                  data-umami-event-url="https://347facts.com?ref=sr347.com"
                  data-umami-event-position="footer"
                  className="inline-flex rounded-md bg-slate-800/10 px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-800/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  Visit 347Facts.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl text-balance px-4 py-8 text-center text-sm italic text-slate-400 md:text-base">
        <p>
          This website is not affiliated with or endorsed by the City of Maricopa or the Arizona Department of Transportation. All content is for informational
          purposes only and does not represent the City's or ADOT's official views.
        </p>
      </section>

      <footer className="relative isolate overflow-hidden bg-slate-900">
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
                        <a
                          key={item.name}
                          href={item.href}
                          className="block p-2 hover:text-indigo-600"
                          data-umami-event="donate-link-click"
                          data-umami-event-url={item.href}
                          target="_blank"
                          rel="noreferrer"
                        >
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
