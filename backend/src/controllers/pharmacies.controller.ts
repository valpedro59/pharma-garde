import { db } from "../config/db.js";
import { eq } from "drizzle-orm";
import { arrondissements, pharmacies, villes } from "../models/schema.js";

/**
 * Toutes les pharmacies d'un arrondissement (ouvertes ou non — pas de
 * filtre sur les gardes ici, voir gardes.controller.ts pour "ouvert
 * maintenant").
 */
export const getPharmaciesParArrondissement = async (
  arrondissementId: number,
) => {
  return await db.query.pharmacies.findMany({
    where: eq(pharmacies.arrondissementId, arrondissementId),
    with: {
      arrondissement: {
        with: {
          ville: true,
        },
      },
    },
  });
};

/**
 * Toutes les pharmacies d'une ville (ouvertes ou non).
 */
export const getPharmaciesParVille = async (villeId: number) => {
  return await db
    .select({
      id: pharmacies.id,
      nom: pharmacies.nom,
      telephone1: pharmacies.telephone1,
      telephone2: pharmacies.telephone2,
      adresseTextuelle: pharmacies.adresseTextuelle,
      googleMapsUrl: pharmacies.googleMapsUrl,
      iframeUrl: pharmacies.iframeUrl,
      arrondissementNom: arrondissements.nom,
    })
    .from(pharmacies)
    .innerJoin(
      arrondissements,
      eq(pharmacies.arrondissementId, arrondissements.id),
    )
    .where(eq(arrondissements.villeId, villeId));
};

/**
 * Arborescence villes -> arrondissements, à PLAT (une ligne par couple
 * ville/arrondissement, en snake_case) : c'est la forme que le frontend
 * (searchForm/shortcuts + RechercheContext) attend. On n'utilise
 * volontairement PAS l'API relationnelle de Drizzle ici — elle renvoie
 * une arborescence imbriquée en camelCase (id/nom/arrondissements),
 * une forme différente qui casse silencieusement le <select> des villes
 * et les compteurs de Shortcuts côté React (ville_nom undefined).
 */
export const getArborescenceGeographique = async () => {
  return await db
    .select({
      ville_id: villes.id,
      ville_nom: villes.nom,
      arrondissement_id: arrondissements.id,
      arrondissement_nom: arrondissements.nom,
    })
    .from(villes)
    .leftJoin(arrondissements, eq(villes.id, arrondissements.villeId))
    .orderBy(villes.nom, arrondissements.nom);
};
