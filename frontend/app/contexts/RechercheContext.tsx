import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  recupererGeographie,
  rechercherPharmaciesDeGarde,
  rechercherPharmaciesParVille,
} from "~/lib/pharmacies";
import { ApiError } from "~/lib/api";
import type { ZoneGeographique, PharmacieOuverte } from "~/lib/types";

type Filtre = "arrondissement" | "ville";

interface RechercheContextValeur {
  zones: ZoneGeographique[];
  chargementZones: boolean;
  erreurZones: string | null;

  villes: { id: number; nom: string }[];
  villeId: number | null;
  arrondissementId: number | null;
  arrondissementsDeVilleActuelle: ZoneGeographique[];

  filtreActif: Filtre;
  aDejaCherche: boolean;

  resultatsArrondissement: PharmacieOuverte[] | null;
  chargementArrondissement: boolean;
  erreurArrondissement: string | null;

  resultatsVilleActuelle: PharmacieOuverte[] | null;
  chargementVilleActuelle: boolean;
  erreurVille: string | null;

  changerVille: (id: number) => void;
  changerArrondissement: (id: number) => void;
  rechercherParArrondissement: () => Promise<void>;
  /** Rebascule l'affichage sur les résultats "arrondissement" déjà en mémoire,
   *  sans relancer d'appel ni réinitialiser quoi que ce soit. */
  revenirArrondissement: () => void;
  /** Bascule sur "toute la ville" + charge (ou réutilise le cache) ses résultats. */
  afficherVille: (villeId: number) => Promise<void>;
  /** Nombre de pharmacies ouvertes pour une ville, si déjà chargé (sinon null). */
  obtenirNombreOuvertes: (villeId: number) => number | null;
  /** Précharge le compteur d'une ville sans changer la vue active (pour Shortcuts). */
  chargerNombreOuvertes: (villeId: number) => void;
}

const RechercheContext = createContext<RechercheContextValeur | null>(null);

export function RechercheProvider({ children }: { children: ReactNode }) {
  const [zones, setZones] = useState<ZoneGeographique[]>([]);
  const [chargementZones, setChargementZones] = useState(true);
  const [erreurZones, setErreurZones] = useState<string | null>(null);

  const [villeId, setVilleId] = useState<number | null>(null);
  const [arrondissementId, setArrondissementId] = useState<number | null>(null);

  const [filtreActif, setFiltreActif] = useState<Filtre>("arrondissement");
  const [aDejaCherche, setADejaCherche] = useState(false);

  const [resultatsArrondissement, setResultatsArrondissement] =
    useState<PharmacieOuverte[] | null>(null);
  const [chargementArrondissement, setChargementArrondissement] = useState(false);
  const [erreurArrondissement, setErreurArrondissement] = useState<string | null>(null);

  // Cache par ville : Shortcuts affiche un compteur pour Pointe-Noire ET
  // Brazzaville simultanément, donc une seule valeur "resultatsVille" ne suffit
  // plus (contrairement à la version précédente, une seule ville à la fois).
  const [resultatsParVille, setResultatsParVille] = useState<
    Record<number, PharmacieOuverte[]>
  >({});
  const [chargementParVille, setChargementParVille] = useState<Record<number, boolean>>(
    {}
  );
  const [erreurVille, setErreurVille] = useState<string | null>(null);

  useEffect(() => {
    recupererGeographie()
      .then((donnees) => {
        setZones(donnees);
        if (donnees.length > 0) {
          setVilleId(donnees[0].ville_id);
        }
      })
      .catch((err) => {
        setErreurZones(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger les zones géographiques."
        );
      })
      .finally(() => setChargementZones(false));
  }, []);

  const villes = zones.reduce<{ id: number; nom: string }[]>((acc, zone) => {
    if (!acc.some((v) => v.id === zone.ville_id)) {
      acc.push({ id: zone.ville_id, nom: zone.ville_nom });
    }
    return acc;
  }, []);

  const arrondissementsDeVilleActuelle = zones.filter(
    (zone) => zone.ville_id === villeId && zone.arrondissement_id !== null
  );

  const changerVille = useCallback((id: number) => {
    setVilleId(id);
    setArrondissementId(null);
    setResultatsArrondissement(null);
    setADejaCherche(false);
    setFiltreActif("arrondissement");
  }, []);

  const changerArrondissement = useCallback((id: number) => {
    setArrondissementId(id);
  }, []);

  const chargerVille = useCallback(
    async (id: number) => {
      // Déjà en cache (même un tableau vide) : on ne refait pas l'appel.
      if (resultatsParVille[id] !== undefined) return;

      setChargementParVille((prev) => ({ ...prev, [id]: true }));
      try {
        const donnees = await rechercherPharmaciesParVille(id);
        setResultatsParVille((prev) => ({ ...prev, [id]: donnees }));
      } catch (err) {
        setErreurVille(
          err instanceof ApiError
            ? err.message
            : "Une erreur est survenue. Réessayez."
        );
      } finally {
        setChargementParVille((prev) => ({ ...prev, [id]: false }));
      }
    },
    [resultatsParVille]
  );

  const rechercherParArrondissement = useCallback(async () => {
    if (!arrondissementId) {
      setErreurArrondissement("Sélectionnez un arrondissement.");
      return;
    }

    setErreurArrondissement(null);
    setChargementArrondissement(true);
    setFiltreActif("arrondissement");
    setADejaCherche(true);

    try {
      const donnees = await rechercherPharmaciesDeGarde(arrondissementId);
      setResultatsArrondissement(donnees);
    } catch (err) {
      setErreurArrondissement(
        err instanceof ApiError
          ? err.message
          : "Une erreur est survenue. Réessayez."
      );
      setResultatsArrondissement(null);
    } finally {
      setChargementArrondissement(false);
    }
  }, [arrondissementId]);

  const revenirArrondissement = useCallback(() => {
    setFiltreActif("arrondissement");
  }, []);

  const afficherVille = useCallback(
    async (id: number) => {
      setVilleId(id);
      setFiltreActif("ville");
      setADejaCherche(true);
      await chargerVille(id);
    },
    [chargerVille]
  );

  const chargerNombreOuvertes = useCallback(
    (id: number) => {
      chargerVille(id);
    },
    [chargerVille]
  );

  const obtenirNombreOuvertes = useCallback(
    (id: number) => resultatsParVille[id]?.length ?? null,
    [resultatsParVille]
  );

  const valeur: RechercheContextValeur = {
    zones,
    chargementZones,
    erreurZones,
    villes,
    villeId,
    arrondissementId,
    arrondissementsDeVilleActuelle,
    filtreActif,
    aDejaCherche,
    resultatsArrondissement,
    chargementArrondissement,
    erreurArrondissement,
    resultatsVilleActuelle: villeId !== null ? resultatsParVille[villeId] ?? null : null,
    chargementVilleActuelle: villeId !== null ? chargementParVille[villeId] ?? false : false,
    erreurVille,
    changerVille,
    changerArrondissement,
    rechercherParArrondissement,
    revenirArrondissement,
    afficherVille,
    obtenirNombreOuvertes,
    chargerNombreOuvertes,
  };

  return (
    <RechercheContext.Provider value={valeur}>{children}</RechercheContext.Provider>
  );
}

export function useRecherche() {
  const contexte = useContext(RechercheContext);
  if (!contexte) {
    throw new Error(
      "useRecherche() doit être appelé à l'intérieur d'un <RechercheProvider>."
    );
  }
  return contexte;
}
