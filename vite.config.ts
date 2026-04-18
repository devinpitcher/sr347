import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [tailwindcss(), cloudflare({ viteEnvironment: { name: "ssr" } }), tanstackStart(), viteReact(), svgr()],
  define: {
    "import.meta.env.COMMIT_SHA": JSON.stringify(process.env.WORKERS_CI_COMMIT_SHA ?? ""),
  },
});
