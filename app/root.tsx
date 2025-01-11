import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import "./styles.pcss";
import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Providers } from "~/utils/context";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  return json({
    appVersion: context.cloudflare.env.CF_PAGES_COMMIT_SHA,
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { appVersion } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script defer src="/u.js" data-website-id="5b5ededc-9eda-47cf-bf1b-34e897a21c62" data-domains="sr347.com" data-host-url="https://sr347.com"></script>
      </head>
      <body className="min-h-screen dark:bg-slate-900 dark:text-white">
        <Providers appVersion={appVersion}>{children}</Providers>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
