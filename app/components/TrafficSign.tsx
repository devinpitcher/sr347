import SR347Logo from "~/assets/sr347.svg?react";
import I10Logo from "~/assets/i10.svg?react";
import reactStringReplace from "react-string-replace";
import classNames from "classnames";
import { useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { determineTrafficStatus } from "~/utils/traffic";

dayjs.extend(relativeTime);

interface TrafficSignProps {
  className?: string;
  name: string;
  description: string;
  duration?: number;
  durationInTraffic?: number;
  lastUpdated?: string;
}

export default function TrafficSign({ name, description, durationInTraffic = 0, duration = 0, lastUpdated, className }: TrafficSignProps) {
  const lastUpdatedRef = useRef<HTMLSpanElement>(null);
  const status = useMemo(() => determineTrafficStatus(duration, durationInTraffic), [duration, durationInTraffic]);

  useEffect(() => {
    if (!lastUpdatedRef.current) return;

    const interval = setInterval(() => {
      lastUpdatedRef.current!.innerText = dayjs().to(lastUpdated);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [lastUpdated, lastUpdatedRef.current]);

  const difference = durationInTraffic - duration;

  return (
    <div
      className={classNames(
        "rounded p-2 transition-colors duration-300",
        {
          "bg-green-600 text-white": status === "clear",
          "bg-amber-500 text-white": status === "delayed",
          "bg-red-600 text-white": status === "slow",
          "bg-gray-100 text-gray-500": status === "unknown",
        },
        className
      )}
    >
      <div className="border-whiter rounded-lg border-[3px] p-4 ">
        <div className="flex flex-row items-center text-2xl font-semibold">
          {reactStringReplace(name, "347", (match, i) => (
            <SR347Logo width={36} className="ml-2" key={match + i} />
          ))}
        </div>

        <div className="mt-1 flex flex-row items-center whitespace-break-spaces">
          {reactStringReplace(description, "I-10", (match, i) => (
            <I10Logo width={20} className="" key={match + i} />
          ))}
        </div>

        <div
          className={classNames("my-3 inline-block rounded bg-white px-2 py-0.5 text-xl font-semibold transition-colors duration-300", {
            "text-green-600 dark:text-green-800": status === "clear",
            "text-amber-500": status === "delayed",
            "text-red-600": status === "slow",
          })}
        >
          {duration ? <span>{Math.ceil(Math.max(durationInTraffic, duration) / 60)} mins</span> : <Loader />}
        </div>

        {status === "delayed" || status === "slow" ? (
          <p className="mb-2 text-sm">
            Traffic is adding <strong>{Math.ceil(difference / 60)} mins</strong> to this route
          </p>
        ) : null}

        <div className="flex flex-row items-center text-sm">
          <span className="font-semibold">Last updated:&nbsp;</span>
          {lastUpdated ? (
            <span ref={lastUpdatedRef}>{dayjs().to(lastUpdated)}</span>
          ) : (
            <span className="ml-1 inline-block pt-1">
              <Loader />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex flex-row gap-1 px-1 py-2">
      <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-.3s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-.5s]"></div>
    </div>
  );
}
