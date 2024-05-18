import { type PlatformProxy } from "wrangler";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}

interface Env {
  MAPS_API_KEY: string;
  KV: KVNamespace;
  AZ511_API_KEY: string;
}
