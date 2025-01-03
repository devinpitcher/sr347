import { createContext } from "react";

type AppContext = {
  appVersion?: string;
};

export const appContext = createContext<AppContext>({
  appVersion: undefined,
});
