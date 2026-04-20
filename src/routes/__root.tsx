/// <reference types="vite/client" />
import { PropsWithChildren, ReactNode } from "react";
import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SWRConfig } from "swr";
import { UMAMI_WEBSITE_ID } from "~/constants/umami";
import { swrConfig } from "~/lib/swr";
import stylesheet from "~/style.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "SR347.com",
      },
      {
        name: "description",
        content: "Check the traffic before you leave! Travel times, live cameras, and ADOT alerts, all in one place.",
      },
    ],
    links: [{ rel: "stylesheet", href: stylesheet }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <Providers>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </Providers>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen dark:bg-slate-900 dark:text-white">
        {children}
        <Scripts />
        <script defer src="/u.js" data-website-id={UMAMI_WEBSITE_ID} data-domains="sr347.com" data-host-url="https://sr347.com"></script>
      </body>
    </html>
  );
}

interface ProvidersProps {}

function Providers({ children }: PropsWithChildren<ProvidersProps>) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
