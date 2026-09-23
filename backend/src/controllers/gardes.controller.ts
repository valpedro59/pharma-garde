import { db } from "../config/db.js";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import {
  arrondissements,
  gardes,
  pharmacies,
  signalements,
} from "../models/schema.js";
import {
  calculerSeuilTemporel,
  SEUIL_SIGNALEMENTS,
} from "../config/signalements.js";

/**
 * Sous-requête corrélée : vrai si la pharmacie a atteint le seuil de
 * signalements récents (.
 */
const champSignaleeFermee = () => {
  // On convertit la Date renvoyée par la fonction en chaîne au format ISO
  const seuilIso = calculerSeuilTemporel().toISOString();

  return sql<boolean>`(
    SELECT COUNT(*) FROM ${signalements}
    WHERE ${signalements.pharmacieId} = ${pharmacies.id}
      AND ${signalements.creeAt} >= ${seuilIso}
  ) >= ${SEUIL_SIGNALEMENTS}`;
};

/**
 * Pharmacies actuellement ouvertes (une garde active couvre l'instant
 * présent) dans un arrondissement donné.
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
      heure_debut: gardes.dateDebut,
      heure_fin: gardes.dateFin,
      signalee_fermee: champSignaleeFermee(),
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
      heure_debut: gardes.dateDebut,
      heure_fin: gardes.dateFin,
      signalee_fermee: champSignaleeFermee(),
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
