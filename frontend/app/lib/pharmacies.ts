import { api } from "./api";
import type { ZoneGeographique, PharmacieOuverte } from "./types";

/**
 * Centralise les requetes http pour la gestion des pharmacies et des zones géographiques.
 */

// récupérer la liste des villes et des arrondissements.
export const recupererGeographie = () =>
  api.get<ZoneGeographique[]>("/geographie");

// récupérer la liste des pharmacies ouvertes dans un arrondissement.
export const rechercherPharmaciesDeGarde = (arrondissementId: number) =>
  api.get<PharmacieOuverte[]>(
    `/gardes/recherche?arrondissement_id=${arrondissementId}`,
  );

// récupérer l'ensemble des pharmacies de garde dans toute la ville
export const rechercherPharmaciesParVille = (villeId: number) =>
  api.get<PharmacieOuverte[]>(`/gardes/recherche-ville?ville_id=${villeId}`);

// signale une pharmacie de garde en réalité fermée
export const signalerFermeture = (pharmacieId: number) =>
  api.post<{ message: string }>(`/pharmacies/${pharmacieId}/signalements`, {});
