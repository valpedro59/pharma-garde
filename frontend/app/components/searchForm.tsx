import { type FormEvent } from "react";
import Button from "./button";
import {
  Ambulance,
  BuildingComplex,
  Funnel,
  LocateFixed,
  Map,
  Search,
} from "lucide-react";
import { useRecherche } from "~/contexts/RechercheContext";
import PharmacieCard from "./pharmacieCard";

const SearchForm = () => {
  const {
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
    resultatsVilleActuelle,
    chargementVilleActuelle,
    erreurVille,
    changerVille,
    changerArrondissement,
    rechercherParArrondissement,
    revenirArrondissement,
    afficherVille,
  } = useRecherche();

  const villeSelectionnee = villes.find((v) => v.id === villeId);

  const gererSoumission = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    rechercherParArrondissement();
  };

  const resultatsAffiches =
    filtreActif === "ville" ? resultatsVilleActuelle : resultatsArrondissement;
  const chargementAffiche =
    filtreActif === "ville"
      ? chargementVilleActuelle
      : chargementArrondissement;
  const erreurAffichee =
    filtreActif === "ville" ? erreurVille : erreurArrondissement;

  return (
    <section className="padding-section">
      <div className="max-w-7xl flex flex-col gap-3  mx-auto md:padding-x">
        <form
          className="flex flex-col bg-white gap-8 p-4 rounded-xl shadow-2xl"
          onSubmit={gererSoumission}
        >
          <div className="flex gap-2 items-center">
            <span className="bg-emerald-50 p-3 rounded-md">
              <Funnel size={24} />
            </span>
            <div>
              <h3 className="headline-md md:headline-lg">Recherche par Zone</h3>
              <p className="body-md text-on-surface-variant">
                Selectionnez votre ville ensuite votre arrondissement
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end justify-center gap-4 md:flex-row">
            {/* Ville Input */}
            <div className="flex-1 w-full">
              <div className="label-md flex items-center gap-2 mb-1">
                <span>
                  <BuildingComplex />
                </span>
                <span>1. Ville</span>
              </div>
              <select
                className="w-full h-12 pl-space-md pr-10 rounded-btn border border-stone-300 label-lg appearance-none focus:outline-none focus:bg-emerald-50 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                value={villeId ?? ""}
                onChange={(e) => changerVille(Number(e.target.value))}
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

            {/* Arrondissement Input */}

            <div className="flex-1 w-full">
              <div className="label-md flex items-center gap-2 mb-1">
                <span>
                  <Map />
                </span>
                <span>2. Arrondissement</span>
              </div>
              <select
                className="w-full h-12 pl-space-md pr-10 rounded-btn border border-stone-300 label-lg appearance-none focus:outline-none focus:bg-emerald-50 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                value={arrondissementId ?? ""}
                onChange={(e) => changerArrondissement(Number(e.target.value))}
                disabled={arrondissementsDeVilleActuelle.length === 0}
              >
                <option value="" disabled>
                  {arrondissementsDeVilleActuelle.length === 0
                    ? "Choisissez d'abord une ville"
                    : "Choisir..."}
                </option>
                {arrondissementsDeVilleActuelle.map((zone) => (
                  <option
                    key={zone.arrondissement_id}
                    value={zone.arrondissement_id!}
                  >
                    {zone.arrondissement_nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 w-full">
              {/* Button Valider */}
              <Button
                className="h-12 w-full"
                type="submit"
                variant="primary"
                icon={<Search />}
                isLoading={chargementArrondissement}
              >
                Trouver une pharmacie de garde
              </Button>
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

          <Button type="button" variant="danger" icon={<Ambulance />}>
            Urgence vitale immédiate : SAMU 112
          </Button>
        </form>

        {/* Barre de filtre + résultats : visible après une recherche par
            arrondissement OU un clic sur "Consulter les gardes" (Shortcuts) */}
        {aDejaCherche && (
          <div
            id="resultats-pharmacies"
            className="flex flex-col gap-4 mt-6 scroll-mt-24"
          >
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={revenirArrondissement}
                className={`label-md px-4 py-2 rounded-full transition-colors btn-interaction ${
                  filtreActif === "arrondissement"
                    ? "bg-emerald-900 text-on-primary"
                    : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                }`}
              >
                Cet arrondissement
                {resultatsArrondissement &&
                  ` (${resultatsArrondissement.length})`}
              </button>
              <button
                type="button"
                onClick={() => villeId && afficherVille(villeId)}
                className={`label-md px-4 py-2 rounded-full transition-colors btn-interaction ${
                  filtreActif === "ville"
                    ? "bg-emerald-900 text-on-primary"
                    : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                }`}
              >
                Toute la ville
                {villeSelectionnee ? ` (${villeSelectionnee.nom})` : ""}
                {resultatsVilleActuelle &&
                  ` — ${resultatsVilleActuelle.length}`}
              </button>
            </div>

            {erreurAffichee && (
              <p
                role="alert"
                className="body-sm text-on-error-container bg-error-container px-space-sm py-2 rounded-md"
              >
                {erreurAffichee}
              </p>
            )}

            {chargementAffiche && (
              <p className="body-md text-on-surface-variant text-center py-4">
                Chargement des pharmacies...
              </p>
            )}

            {!chargementAffiche &&
              resultatsAffiches &&
              resultatsAffiches.length === 0 && (
                <p className="body-md text-on-surface-variant text-center py-4">
                  Aucune pharmacie ouverte ou de garde trouvée pour le moment.
                </p>
              )}

            {!chargementAffiche &&
              resultatsAffiches &&
              resultatsAffiches.map((pharmacie) => (
                <PharmacieCard key={pharmacie.id} pharmacie={pharmacie} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchForm;
