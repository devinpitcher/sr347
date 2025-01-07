import { useContext, useRef, useState } from "react";
import classNames from "classnames";
import I10Logo from "../assets/i10.svg?react";
import reactStringReplace from "react-string-replace";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { appContext } from "~/utils/context";
import { APP_VERSION_HEADER } from "~/constants/app";

interface CameraProps {
  id: string;
  name: string;
  note?: string;
}

export default function Camera({ id, name, note }: CameraProps) {
  const { appVersion } = useContext(appContext);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useSWR(
    `/api/camera/${id}`,
    async (url: string) => {
      const requestUrl = new URL(url, window.location.href);

      requestUrl.searchParams.set("v", Date.now().toString());

      const result = await fetch(requestUrl, {
        headers: {
          [APP_VERSION_HEADER]: appVersion ?? "",
        },
      });

      if (!result.ok) {
        throw new Error(result.statusText);
      }

      if (result.headers.get(APP_VERSION_HEADER) !== appVersion) {
        window.location.reload();
      }

      return result;
    },
    {
      revalidateOnMount: true,
      refreshInterval: 15 * 1_000,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      errorRetryInterval: 30_000,
      errorRetryCount: 5,
      keepPreviousData: true,
      onSuccess: async (response) => {
        if (!imageRef.current || !response) return;

        setHasError(false);

        try {
          URL.revokeObjectURL(imageRef.current.src);
        } catch {
          //
        }

        try {
          const blob = await response.blob();

          imageRef.current.src = URL.createObjectURL(blob);

          setHasLoaded(true);
        } catch {
          setHasError(true);
        }
      },
      onError: () => {
        setHasError(true);
      },
    }
  );

  return (
    <div>
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gray-100 shadow-inner dark:bg-slate-800">
        {!hasError && (
          <img ref={imageRef} className={classNames("z-10 h-full w-full object-cover transition-opacity", { "opacity-0": !hasLoaded || hasError })} alt="" />
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
