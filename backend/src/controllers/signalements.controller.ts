import { db } from "../config/db.js";
import { eq } from "drizzle-orm";
import { pharmacies, signalements } from "../models/schema.js";

/**
 * Enregistre un signalement de fermeture pour une pharmacie.
 * Retourne `null` si la pharmacie n'existe pas, pour laisser la route
 * répondre 404 plutôt que de créer un signalement orphelin.
 */
export const creerSignalement = async (pharmacieId: number) => {
  const pharmacie = await db.query.pharmacies.findFirst({
    where: eq(pharmacies.id, pharmacieId),
    columns: { id: true },
  });

  if (!pharmacie) return null;

  const [signalement] = await db
    .insert(signalements)
    .values({ pharmacieId })
    .returning();

  return signalement;
};
