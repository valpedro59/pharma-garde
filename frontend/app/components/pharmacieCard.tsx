import { Phone, MapPin, TriangleAlert, Route, Clock } from "lucide-react";
import React, { useState } from "react";
import type { PharmacieOuverte } from "~/lib/types";
import { signalerFermeture } from "~/lib/pharmacies";
import { ApiError } from "~/lib/api";
import Button from "./button";

interface PharmacieCardProps {
  pharmacie: PharmacieOuverte;
}

const CLE_SIGNALEMENTS_LOCAUX = "pharmagarde_signalements";

/**
 * Formate une chaîne de date ISO en format lisible (ex: "08h00").
 */
const formaterHeure = (dateIso?: string | Date): string => {
  if (!dateIso) return "";
  const date = new Date(dateIso);
  if (isNaN(date.getTime())) return "";

  return date
    .toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "h");
};

/** Pharmacies déjà signalées par CE navigateur (protection anti-spam
 *  légère, en attendant un vrai système de comptes). */
const dejaSignaleeLocalement = (id: number): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const liste: number[] = JSON.parse(
      localStorage.getItem(CLE_SIGNALEMENTS_LOCAUX) ?? "[]",
    );
    return liste.includes(id);
  } catch {
    return false;
  }
};

const memoriserSignalement = (id: number) => {
  if (typeof window === "undefined") return;
  try {
    const liste: number[] = JSON.parse(
      localStorage.getItem(CLE_SIGNALEMENTS_LOCAUX) ?? "[]",
    );
    localStorage.setItem(
      CLE_SIGNALEMENTS_LOCAUX,
      JSON.stringify([...liste, id]),
    );
  } catch {
    // localStorage indisponible (navigation privée, quota, etc.)
  }
};

const PharmacieCard: React.FC<PharmacieCardProps> = ({ pharmacie }) => {
  const mapEmbedUrl = pharmacie.iframe_url;

  const [signalementEnvoye, setSignalementEnvoye] = useState(() =>
    dejaSignaleeLocalement(pharmacie.id),
  );
  const [signalementEnCours, setSignalementEnCours] = useState(false);
  const [erreurSignalement, setErreurSignalement] = useState<string | null>(
    null,
  );

  const gererSignalement = async () => {
    setErreurSignalement(null);
    setSignalementEnCours(true);
    try {
      await signalerFermeture(pharmacie.id);
      memoriserSignalement(pharmacie.id);
      setSignalementEnvoye(true);
    } catch (err) {
      setErreurSignalement(
        err instanceof ApiError ? err.message : "Une erreur est survenue.",
      );
    } finally {
      setSignalementEnCours(false);
    }
  };

  const heureDebut = formaterHeure(pharmacie.heure_debut);
  const heureFin = formaterHeure(pharmacie.heure_fin);

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white p-6 rounded-xl shadow-sm border border-stone-100">
      {/* Carte Google Maps intégrée */}
      <div className="w-full md:w-80 h-48 md:h-auto shrink-0 overflow-hidden rounded-lg bg-stone-100">
        {mapEmbedUrl ? (
          <iframe
            title={`Carte ${pharmacie.nom}`}
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-stone-400">
            <MapPin size={32} />
            <span className="body-sm text-center mt-2">
              Carte non disponible
            </span>
          </div>
        )}
      </div>

      {/* Informations de la pharmacie */}
      <div className="flex flex-col justify-between gap-4 w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="headline-md font-bold text-stone-900">
              {pharmacie.nom}
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {/* badge d'avertissement si le seuil de
                  signalements récents est atteint */}
              {pharmacie.signalee_fermee && (
                <span className="label-sm px-3 py-1 rounded-full whitespace-nowrap font-medium bg-orange-100 text-orange-900 inline-flex items-center gap-1">
                  <TriangleAlert size={14} />
                  Signalée fermée récemment
                </span>
              )}
              <span
                className={`label-sm px-3 py-1 rounded-full whitespace-nowrap font-medium ${
                  pharmacie.statut_actuel === "OUVERTURE_NORMALE"
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {pharmacie.statut_actuel === "OUVERTURE_NORMALE"
                  ? "Ouverture normale"
                  : "Pharmacie de garde"}
              </span>
            </div>
          </div>

          <p className="body-sm text-on-surface-variant flex items-start gap-1.5">
            <MapPin size={16} className="shrink-0 mt-0.5 text-stone-500" />
            <span>{pharmacie.adresse_textuelle}</span>
          </p>

          {/* Affichage des horaires de garde */}
          {heureDebut && heureFin && (
            <p className="body-sm text-stone-700 font-medium flex items-center gap-1.5">
              <Clock size={16} className="shrink-0 text-emerald-700" />
              <span>
                Horaires :{" "}
                <strong className="text-stone-900">
                  {heureDebut} - {heureFin}
                </strong>
              </span>
            </p>
          )}

          {erreurSignalement && (
            <p role="alert" className="body-sm text-on-error-container">
              {erreurSignalement}
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col md:flex-row gap-3 items-center pt-2">
          <a
            href={`tel:${pharmacie.telephone_1}`}
            className="w-full body-md flex items-center justify-center gap-2 font-semibold text-emerald-900 md:w-auto hover:bg-emerald-50 px-3 py-2 rounded-btn"
          >
            <Phone size={16} />
            {pharmacie.telephone_1}
          </a>

          <Button
            type="button"
            className="w-full md:w-auto md:ml-auto"
            variant="danger"
            size="md"
            icon={<TriangleAlert />}
            isLoading={signalementEnCours}
            disabled={signalementEnvoye}
            onClick={gererSignalement}
          >
            {signalementEnvoye ? "Signalement envoyé" : "Signaler comme fermée"}
          </Button>

          <a
            href={pharmacie.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-4 py-2 body-md font-semibold text-white bg-emerald-900 hover:bg-emerald-800 min-h-11 rounded-btn md:w-auto"
          >
            S'y rendre
            <span className="ml-2">
              <Route size={18} />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PharmacieCard;
