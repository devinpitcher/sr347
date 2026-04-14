import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from "@remix-run/react";
import "./styles.pcss";
import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Providers } from "~/utils/context";
import { useRouteError } from "react-router";
import { isRouteErrorResponse } from "@remix-run/router/utils";
import { UMAMI_WEBSITE_ID } from "~/constants/app";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  return json({
    appVersion: context.cloudflare.env.CF_PAGES_COMMIT_SHA,
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script defer src="/u.js" data-website-id={UMAMI_WEBSITE_ID} data-domains="sr347.com" data-host-url="https://sr347.com"></script>
      </head>
      <body className="min-h-screen dark:bg-slate-900 dark:text-white">
        <Providers appVersion={data?.appVersion}>{children}</Providers>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main className="relative isolate h-screen">
        <img
          src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
        />
        <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
          <p className="text-base font-semibold leading-8 text-white">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Page not found</h1>
          <p className="mt-4 text-base text-white/70 sm:mt-6">Sorry, we couldn’t find the page you’re looking for.</p>
          <div className="mt-10 flex justify-center">
            <Link to="/" className="text-sm font-semibold leading-7 text-white">
              <span aria-hidden="true">&larr;</span> Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
