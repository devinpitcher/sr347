import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

const db = drizzle(env.DATABASE, {
  casing: "snake_case",
});

export { db };
