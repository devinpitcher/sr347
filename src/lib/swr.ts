import { SWRConfiguration } from "swr";
import { useCallback, useContext } from "react";
import { APP_VERSION_HEADER } from "~/constants/app";
import { AppContext } from "~/context";

export const swrConfig: SWRConfiguration = {
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: true,
  revalidateOnMount: true,
  revalidateOnReconnect: true,
  fetcher: async (resource, init) => {
    const res = await fetch(resource, init);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  },
};

export const useSWRFetcher = () => {
  const { appVersion } = useContext(AppContext);

  return useCallback(
    async (url: string) => {
      const result = await fetch(url, {
        headers: {
          [APP_VERSION_HEADER]: appVersion ?? "",
        },
      });

      if (!result.ok) {
        throw new SWRFetcherError(result.statusText, result);
      }

      if (result.headers.has(APP_VERSION_HEADER) && result.headers.get(APP_VERSION_HEADER) !== appVersion) {
        window.location.reload();
      }

      return result;
    },
    [appVersion]
  );
};

export class SWRFetcherError extends Error {
  public response: Response;

  constructor(message: string, response: Response) {
    super(message);

    this.response = response;
  }
}
