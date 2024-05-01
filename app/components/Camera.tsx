import { useEffect, useState } from "react";
import classNames from "classnames";
import I10Logo from "../assets/i10.svg?react";
import reactStringReplace from "react-string-replace";
import useTabVisibility from "~/utils/hooks/useTabVisibility";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface CameraProps {
  id: string;
  name: string;
  note?: string;
}

export default function Camera({ id, name, note }: CameraProps) {
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>();
  const shouldUpdate = useTabVisibility();

  useEffect(() => {
    if (hasError || !shouldUpdate) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 15 * 1000);

    setCurrentTime(new Date().getTime());

    return () => {
      clearInterval(interval);
    };
  }, [hasError, shouldUpdate]);

  return (
    <div>
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gray-100 shadow-inner dark:bg-slate-800">
        {!hasError && (
          <img
            className={classNames("z-10 h-full w-full object-cover transition-opacity", { "opacity-0": !hasLoaded || hasError })}
            src={currentTime ? `/api/camera/${id}?v=${currentTime}` : undefined}
            onError={() => {
              setHasError(true);
            }}
            onLoad={() => {
              setHasLoaded(true);
              setHasError(false);
            }}
          />
        )}

        <div className="absolute left-0 top-0 z-0 flex h-full w-full items-center justify-center text-center text-slate-400">
          {hasError ? (
            <div className="px-8">
              <h4 className="text-xl font-semibold">Camera Offline</h4>
              <div className="text-xs">We could not load the camera from ADOT</div>
              {note ? (
                <div className="mt-4 rounded-md border border-slate-400 p-4 text-xs">
                  <InformationCircleIcon width={20} className="-mt-1 inline" /> {note}
                </div>
              ) : null}
            </div>
          ) : (
            <h4 className="text-xl font-semibold">Loading Camera Feed...</h4>
          )}
        </div>
      </div>

      <div className="py-2 text-center lg:text-left">
        <div className="inline-block rounded-md bg-green-700 p-0.5 text-white">
          <div className="flex flex-row items-center rounded-md border-2 border-white px-3 py-0.5">
            {reactStringReplace(name, "I-10", (match, i) => (
              <I10Logo width={20} className="mr-1.5" key={match + i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
