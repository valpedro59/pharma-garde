import { api } from "./api";
import type { ZoneGeographique, PharmacieOuverte } from "./types";

export const recupererGeographie = () =>
  api.get<ZoneGeographique[]>("/geographie");

export const rechercherPharmaciesDeGarde = (arrondissementId: number) =>
  api.get<PharmacieOuverte[]>(
    `/gardes/recherche?arrondissement_id=${arrondissementId}`,
  );
