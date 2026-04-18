import { drizzleD1Config } from "@deox/drizzle-d1-utils";

export default drizzleD1Config(
  {
    schema: "./src/database/schema.ts",
    out: "./drizzle/migrations",
    casing: "snake_case",
  },
  { binding: "DATABASE" }
);
