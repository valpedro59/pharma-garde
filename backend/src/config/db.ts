import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./env";
import * as schema from "../models/schema";

const databaseUrl = env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not set");

let connectionString = databaseUrl;
if (connectionString.includes("postgres:postgres@supabase_db_")) {
  const url = new URL(connectionString);
  url.hostname = url.hostname.split("_")[1];
  connectionString = url.href;
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

// Vérification de connexion au démarrage (équivalent du "SELECT NOW()"
// qu'on avait avec le pool pg). Ne bloque pas le serveur si ça échoue,
// mais te le signale immédiatement dans les logs.
client`SELECT NOW()`
  .then((resultat) => {
    console.log("✅ Connecté à Supabase avec succès :", resultat[0].now);
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à Supabase :", err.message);
  });
