import { createContext, PropsWithChildren, useMemo } from "react";
import { SWRConfig, SWRConfiguration } from "swr";

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
    } satisfies SWRConfiguration;
  }, []);

  return (
    <AppContext.Provider value={{ appVersion }}>
      <SWRConfig value={swrConfig}>{children}</SWRConfig>
    </AppContext.Provider>
  );
};
