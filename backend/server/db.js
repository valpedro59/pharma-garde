import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err.stack);
  } else {
    console.log("Connecté à la base de données PostgreSQL avec succès.");
  }
});

export const query = (text, params) => pool.query(text, params);
export default pool;

// import { PrismaClient } from "../prisma/generated/client";
// import { PrismaPg } from "@prisma/adapter-pg";

// const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// export const prisma = new PrismaClient({ adapter });
