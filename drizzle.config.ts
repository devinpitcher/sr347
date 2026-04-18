import { drizzleD1Config } from "@deox/drizzle-d1-utils";

export default drizzleD1Config(
  {
    schema: "./src/database/schema.ts",
    out: "./drizzle",
    casing: "camelCase",
  },
  { binding: "DATABASE" }
);
