import { createContext } from "react";

export interface IAppContext {
  appVersion: string;
}

export const AppContext = createContext<IAppContext>({
  appVersion: "",
});
