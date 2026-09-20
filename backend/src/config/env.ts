import dotenv from "dotenv";
dotenv.config();
interface Env {
  PORT: number;
  DATABASE_URL: string;
  DIRECT_URL: string;
  NODE_ENV: "development" | "production" | "test";
}

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};
export const env: Env = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: required("DATABASE_URL"),
  DIRECT_URL: required("DIRECT_URL"),
  NODE_ENV: (process.env.NODE_ENV as Env["NODE_ENV"]) || "development",
};
