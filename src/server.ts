import handler from "@tanstack/react-start/server-entry";
import { updateAlerts } from "~/lib/alerts";
import { waitUntil } from "cloudflare:workers";

export default {
  fetch: handler.fetch as ExportedHandlerFetchHandler,

  async scheduled(event) {
    switch (event.cron) {
      case "*/5 * * * *":
        console.log("Updating alerts...");
        waitUntil(
          updateAlerts()
            .then(() => {
              console.log("Alerts updated");
            })
            .catch((err) => {
              console.error(err);
            })
        );
        break;
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>;
