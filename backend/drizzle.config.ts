import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env";
export default defineConfig({
  out: "./drizzle",
  schema: "./src/models/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DIRECT_URL!,
  },
});
