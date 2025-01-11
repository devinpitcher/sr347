import { createContext } from "react";

interface IAppContext {
  appVersion?: string;
}

export const AppContext = createContext<IAppContext>({
  appVersion: undefined,
});
