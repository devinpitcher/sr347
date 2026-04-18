import handler from "@tanstack/react-start/server-entry";

export default {
  fetch: handler.fetch as ExportedHandlerFetchHandler,

  // Cron Triggers
  async scheduled(event, env, ctx) {
    console.log("Cron triggered:", event.cron);
  },
} satisfies ExportedHandler<Cloudflare.Env>;
