import { type PlatformProxy } from "wrangler";

type Cloudflare = Omit<
  PlatformProxy<
    Env & {
      UMAMI_API_KEY: string;
    }
  >,
  "dispose"
>;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}
