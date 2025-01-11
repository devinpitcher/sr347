import { useCallback, useContext } from "react";
import { APP_VERSION_HEADER } from "~/constants/app";
import { AppContext } from "~/utils/context";

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
        throw new Error(result.statusText);
      }

      if (result.headers.has(APP_VERSION_HEADER) && result.headers.get(APP_VERSION_HEADER) !== appVersion) {
        window.location.reload();
      }

      return result;
    },
    [appVersion]
  );
};
