import { createContext, PropsWithChildren } from "react";

interface IAppContext {
  appVersion?: string;
}

export const AppContext = createContext<IAppContext>({
  appVersion: undefined,
});

interface ProvidersProps extends IAppContext {}

export const Providers = ({ children, appVersion }: PropsWithChildren<ProvidersProps>) => {
  return <AppContext.Provider value={{ appVersion }}>{children}</AppContext.Provider>;
};
