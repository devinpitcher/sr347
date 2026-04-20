import { SWRConfiguration } from "swr";
import { APP_VERSION, APP_VERSION_HEADER } from "~/constants/app";

export async function swrFetcher(resource: string | URL, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set(APP_VERSION_HEADER, APP_VERSION);

  const res = await fetch(resource, { ...init, headers });

  if (!res.ok) {
    throw new SWRFetcherError(res.statusText, res);
  }

  if (res.headers.has(APP_VERSION_HEADER) && res.headers.get(APP_VERSION_HEADER) !== APP_VERSION) {
    window.location.reload();
  }

  return res;
}

export const swrConfig: SWRConfiguration = {
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: true,
  revalidateOnMount: true,
  revalidateOnReconnect: true,
  fetcher: async (resource: string | URL, init?: RequestInit) => {
    const res = await swrFetcher(resource, init);
    return await res.json();
  },
};

export class SWRFetcherError extends Error {
  public response: Response;

  constructor(message: string, response: Response) {
    super(message);

    this.response = response;
  }
}
