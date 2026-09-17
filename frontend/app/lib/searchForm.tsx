import { useEffect, useState, type FormEvent } from "react";
import Button from "./button";
import {
  Ambulance,
  BuildingComplex,
  Funnel,
  LocateFixed,
  Map,
  Phone,
  Search,
} from "lucide-react";
import {
  recupererGeographie,
  rechercherPharmaciesDeGarde,
} from "~/lib/pharmacies";
import { ApiError } from "~/lib/api";
import type { ZoneGeographique, PharmacieOuverte } from "~/lib/types";

const SearchForm = () => {
  const [zones, setZones] = useState<ZoneGeographique[]>([]);
  const [chargementZones, setChargementZones] = useState(true);
  const [erreurZones, setErreurZones] = useState<string | null>(null);

  const [villeId, setVilleId] = useState<number | null>(null);
  const [arrondissementId, setArrondissementId] = useState<number | null>(null);

  const [resultats, setResultats] = useState<PharmacieOuverte[] | null>(null);
  const [chargementRecherche, setChargementRecherche] = useState(false);
  const [erreurRecherche, setErreurRecherche] = useState<string | null>(null);

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
            : "Impossible de charger les zones géographiques.",
        );
      })
      .finally(() => setChargementZones(false));
  }, []);

  // Dédoublonnage des villes (on évite `new Map` ici : ce nom est déjà pris
  // par l'icône lucide `Map` importée juste au-dessus).
  const villes = zones.reduce<{ id: number; nom: string }[]>((acc, zone) => {
    if (!acc.some((v) => v.id === zone.ville_id)) {
      acc.push({ id: zone.ville_id, nom: zone.ville_nom });
    }
    return acc;
  }, []);

  const arrondissements = zones.filter(
    (zone) => zone.ville_id === villeId && zone.arrondissement_id !== null,
  );

  const gererChangementVille = (id: number) => {
    setVilleId(id);
    setArrondissementId(null);
    setResultats(null);
  };

  const gererSoumission = async (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();

    if (!arrondissementId) {
      setErreurRecherche("Sélectionnez un arrondissement.");
      return;
    }

    setErreurRecherche(null);
    setChargementRecherche(true);

    try {
      const donnees = await rechercherPharmaciesDeGarde(arrondissementId);
      setResultats(donnees);
    } catch (err) {
      setErreurRecherche(
        err instanceof ApiError
          ? err.message
          : "Une erreur est survenue. Réessayez.",
      );
      setResultats(null);
    } finally {
      setChargementRecherche(false);
    }
  };

  return (
    <section className="padding-section">
      <div className="max-w-7xl flex flex-col gap-3 padding-x padding-y mx-auto">
        <form
          className="flex flex-col bg-white gap-8 p-8 rounded-xl shadow-2xl"
          onSubmit={gererSoumission}
        >
          <div className="flex gap-2 items-center">
            <span className="bg-emerald-100 p-3 rounded-md">
              <Funnel size={24} />
            </span>
            <div>
              <h3 className="headline-md md:headline-lg">Recherche par Zone</h3>
              <p className="body-md text-on-surface-variant">
                Selectionnez votre ville ensuite votre arrondissement
              </p>
            </div>
          </div>

          {/* Form Input */}
          <div className="flex flex-col items-start justify-center gap-4 md:flex-row">
            {/* City Input */}
            <div className="flex-1 w-full">
              <div className="label-md flex items-center gap-2 mb-1">
                <span>
                  <BuildingComplex />
                </span>
                <span>1. Ville</span>
              </div>
              <div>
                <select
                  className="w-full h-12 pl-space-md pr-10 rounded-btn bg-emerald-50 label-lg appearance-none focus:outline-none focus:bg-emerald-100 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  value={villeId ?? ""}
                  onChange={(e) => gererChangementVille(Number(e.target.value))}
                  disabled={chargementZones || villes.length === 0}
                >
                  {chargementZones && <option>Chargement...</option>}
                  {!chargementZones && villes.length === 0 && (
                    <option>Aucune ville disponible</option>
                  )}
                  {villes.map((ville) => (
                    <option key={ville.id} value={ville.id}>
                      {ville.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Arrondissement Input */}
            <div className="flex-1 w-full">
              <div className="label-md flex items-center gap-2 mb-1">
                <span>
                  <Map />
                </span>
                <span>2. Arrondissement</span>
              </div>
              <div>
                <select
                  className="w-full h-12 pl-space-md pr-10 rounded-btn bg-emerald-50 label-lg appearance-none focus:outline-none focus:bg-emerald-100 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  value={arrondissementId ?? ""}
                  onChange={(e) => setArrondissementId(Number(e.target.value))}
                  disabled={arrondissements.length === 0}
                >
                  <option value="" disabled>
                    {arrondissements.length === 0
                      ? "Choisissez d'abord une ville"
                      : "Choisir..."}
                  </option>
                  {arrondissements.map((zone) => (
                    <option
                      key={zone.arrondissement_id}
                      value={zone.arrondissement_id!}
                    >
                      {zone.arrondissement_nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {erreurZones && (
            <p
              role="alert"
              className="body-sm text-on-error-container bg-error-container px-space-sm py-2 rounded-md"
            >
              {erreurZones}
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            icon={<LocateFixed />}
            disabled
          >
            Me geolocaliser automatiquement (bientôt disponible)
          </Button>

          <Button
            type="submit"
            variant="primary"
            icon={<Search />}
            isLoading={chargementRecherche}
          >
            Trouver une pharmacie de garde
          </Button>

          <Button type="button" variant="danger" icon={<Ambulance />}>
            Urgence vitale immédiate : SAMU 112
          </Button>

          {erreurRecherche && (
            <p
              role="alert"
              className="body-sm text-on-error-container bg-error-container px-space-sm py-2 rounded-md"
            >
              {erreurRecherche}
            </p>
          )}
        </form>

        {/* Résultats */}
        {resultats && (
          <div className="flex flex-col gap-4 mt-6">
            {resultats.length === 0 ? (
              <p className="body-md text-on-surface-variant text-center">
                Aucune pharmacie ouverte ou de garde trouvée dans cet
                arrondissement pour le moment.
              </p>
            ) : (
              resultats.map((pharmacie) => (
                <div
                  key={pharmacie.id}
                  className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="headline-md">{pharmacie.nom}</h4>
                    <span
                      className={`label-sm px-2 py-1 rounded-full whitespace-nowrap ${
                        pharmacie.statut_actuel === "OUVERTURE_NORMALE"
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-error-container text-on-error-container"
                      }`}
                    >
                      {pharmacie.statut_actuel === "OUVERTURE_NORMALE"
                        ? "Ouvert"
                        : "De garde"}
                    </span>
                  </div>
                  <p className="body-sm text-on-surface-variant">
                    {pharmacie.adresse_textuelle}
                  </p>
                  <a
                    href={`tel:${pharmacie.telephone_1}`}
                    className="body-md flex items-center gap-2 text-emerald-900 font-semibold"
                  >
                    <Phone size={16} />
                    {pharmacie.telephone_1}
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchForm;
