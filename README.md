# SR347.com

A traffic dashboard for SR347 in Maricopa, Arizona. Checks travel times, live cameras, and road alerts.

> This code and SR347.com are not affiliated with or endorsed by the City of Maricopa or ADOT

## What it does

- **Live traffic times** — Real-time travel times from 20+ Maricopa neighborhoods to I-10, powered by the TomTom Routing API. Updates every 5 minutes.
- **Live cameras** — ADOT traffic camera feeds along SR-347 (I-10 at Wild Horse Pass, Queen Creek, Old Maricopa Rd., Riggs Rd., Cement Plant, Casa Blanca Rd.). Refresh every 15 seconds.
- **Road alerts** — Active ADOT incidents and alerts on SR-347.
- **Realtime visitors** — Shows how many people are currently viewing the site via Umami analytics.
- **Advocacy section** — Links to 347facts.com to help residents contact state officials about road safety improvements.

## Tech stack

- **[Remix](https://remix.run/)** — Full-stack React framework
- **[Cloudflare Workers](https://workers.cloudflare.com/)** — Serverless API routes
- **[Upstash Redis](https://upstash.com/)** — Caching for traffic/alert data
- **[TomTom Routing API](https://developer.tomtom.com/)** — Live traffic travel times
- **[ADOT / AZ511](https://az511.com)** — Camera feeds and road alerts
- **[Umami](https://umami.is/)** — Privacy-friendly analytics and realtime visitor counts
- **[Tailwind CSS](https://tailwindcss.com/)** — Styling
- **[Headless UI](https://headlessui.com/)** — Accessible UI primitives
- **[SWR](https://swr.vercel.app/)** — Client-side data fetching with auto-refresh
- **[Vite](https://vitejs.dev/)** — Build tooling
