import { type MouseEventHandler } from "react";

export interface CustomButtonProps {
  title: string;
  containerStyles?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  btnType?: "button" | "submit";
}

export type TypeGarde = "VOLET_OUVERT" | "VOLET_FERME";

export type StatutActuel =
  | "GARDE_VOLET_OUVERT"
  | "GARDE_VOLET_FERME"
  | "OUVERTURE_NORMALE";

export interface Pharmacie {
  id: number;
  nom: string;
  arrondissement_id: number | null;
  telephone_1: string;
  telephone_2: string | null;
  adresse_textuelle: string;
  cree_at: string;
  /** null si la pharmacie n'a pas de coordonnées GPS renseignées */
  longitude: number | null;
  latitude: number | null;
}

/** Réponse de POST et PUT /pharmacies */
export interface ReponsePharmacie {
  message: string;
  pharmacie: Pharmacie;
}

/** Résultat de /gardes/recherche et /gardes/proximite */
export interface PharmacieOuverte {
  id: number;
  nom: string;
  telephone_1: string;
  telephone_2: string | null;
  adresse_textuelle: string;
  longitude: number | null;
  latitude: number | null;
  statut_actuel: StatutActuel;
  /** Présent uniquement sur /gardes/proximite */
  distance_metres?: number;
}

/** Une ligne de /geographie (jointure villes × arrondissements) */
export interface ZoneGeographique {
  ville_id: number;
  ville_nom: string;
  arrondissement_id: number | null;
  arrondissement_nom: string | null;
}

export interface Garde {
  id: number;
  pharmacie_id: number;
  pharmacie_nom: string;
  date_debut: string;
  date_fin: string;
  type_garde: TypeGarde;
}
