import { db } from "../config/db";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { arrondissements, gardes, pharmacies } from "../models/schema.js";

/**
 * Pharmacies actuellement ouvertes (une garde active couvre l'instant
 * présent) dans un arrondissement donné.
 *
 * Pas de table horaires_reguliers dans ce modèle : "ouvert" = il existe
 * une ligne `gardes` telle que date_debut <= now() <= date_fin.
 */
export const getPharmaciesOuvertesParArrondissement = async (
  arrondissementId: number,
) => {
  return await db
    .select({
      id: pharmacies.id,
      nom: pharmacies.nom,
      telephone_1: pharmacies.telephone1,
      telephone_2: pharmacies.telephone2,
      adresse_textuelle: pharmacies.adresseTextuelle,
      google_maps_url: pharmacies.googleMapsUrl,
      iframe_url: pharmacies.iframeUrl,
      statut_actuel: gardes.typeGarde,
    })
    .from(pharmacies)
    .innerJoin(
      gardes,
      and(
        eq(gardes.pharmacieId, pharmacies.id),
        lte(gardes.dateDebut, sql`now()`),
        gte(gardes.dateFin, sql`now()`),
      ),
    )
    .where(eq(pharmacies.arrondissementId, arrondissementId));
};

/**
 * Pharmacies actuellement ouvertes sur toute une ville.
 */
export const getPharmaciesOuvertesParVille = async (villeId: number) => {
  return await db
    .select({
      id: pharmacies.id,
      nom: pharmacies.nom,
      telephone_1: pharmacies.telephone1,
      telephone_2: pharmacies.telephone2,
      adresse_textuelle: pharmacies.adresseTextuelle,
      google_maps_url: pharmacies.googleMapsUrl,
      iframe_url: pharmacies.iframeUrl,
      statut_actuel: gardes.typeGarde,
    })
    .from(pharmacies)
    .innerJoin(
      arrondissements,
      eq(pharmacies.arrondissementId, arrondissements.id),
    )
    .innerJoin(
      gardes,
      and(
        eq(gardes.pharmacieId, pharmacies.id),
        lte(gardes.dateDebut, sql`now()`),
        gte(gardes.dateFin, sql`now()`),
      ),
    )
    .where(eq(arrondissements.villeId, villeId));
};
