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
        <script defer src="/u.js" data-website-id="5b5ededc-9eda-47cf-bf1b-34e897a21c62" data-domains="sr347.com" data-host-url="https://sr347.com"></script>
      </head>
      <body className="min-h-screen dark:bg-slate-900 dark:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
