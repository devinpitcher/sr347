import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import "./styles.pcss";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen dark:bg-slate-900 dark:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
        <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "3d62a1941e8142338628d781b170518b"}' />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
