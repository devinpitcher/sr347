import { createContext, PropsWithChildren, useMemo } from "react";
import { SWRConfig, SWRConfiguration } from "swr";
import { APP_VERSION_HEADER } from "~/constants/app";

interface IAppContext {
  appVersion?: string;
}

export const AppContext = createContext<IAppContext>({
  appVersion: undefined,
});

interface ProvidersProps extends IAppContext {}

export const Providers = ({ children, appVersion }: PropsWithChildren<ProvidersProps>) => {
  const swrConfig = useMemo(() => {
    return {
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      fetcher: async (url: string) => {
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

        if (result.headers.get("content-type") === "application/json") {
          return result.json();
        }

        return result.blob();
      },
    } satisfies SWRConfiguration;
  }, [appVersion]);

  return (
    <AppContext.Provider value={{ appVersion }}>
      <SWRConfig value={swrConfig}>{children}</SWRConfig>
    </AppContext.Provider>
  );
};
