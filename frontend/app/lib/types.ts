import { type MouseEventHandler } from "react";

/* Composant Button */
export interface CustomButtonProps {
  title: string;
  containerStyles?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  btnType?: "button" | "submit";
}
/* Type de garde  */
export type TypeGarde = "JOUR_VOLET_OUVERT" | "NUIT_VOLET_FERME" | "GARDE_24H";

/* Statut actuel de la pharmacie */
export type StatutActuel =
  | "GARDE_VOLET_OUVERT"
  | "GARDE_VOLET_FERME"
  | "OUVERTURE_NORMALE";

/* Composant Pharmacie */
export interface Pharmacie {
  id: number;
  nom: string;
  adresse_textuelle: string;
  telephone_1: string;
  telephone_2: string | null;
  arrondissement_id: number;
  google_maps_url: string;
  iframe_url: string;
  cree_at: string;
}

/** Réponse de POST et PUT /pharmacies */
export interface ReponsePharmacie {
  message: string;
  pharmacie: Pharmacie;
}

/** Résultat de /gardes/recherche */
export interface PharmacieOuverte {
  id: number;
  nom: string;
  telephone_1: string;
  telephone_2: string | null;
  adresse_textuelle: string;
  google_maps_url: string;
  iframe_url: string;
  statut_actuel: StatutActuel;
}

/** Une ligne de /geographie (jointure villes × arrondissements) */
export interface ZoneGeographique {
  ville_id: number;
  ville_nom: string;
  arrondissement_id: number | null;
  arrondissement_nom: string | null;
}

/* Garde */
export interface Garde {
  id: number;
  pharmacie_id: number;
  pharmacie_nom: string;
  date_debut: string;
  date_fin: string;
  type_garde: TypeGarde;
}

// --- Authentification ---

export type Role = "ADMIN" | "PHARMACIEN";

export interface Utilisateur {
  id: number;
  email: string;
  role: Role;
  pharmacie_id: number | null;
}

export interface ReponseLogin {
  token: string;
  utilisateur: Utilisateur;
}
