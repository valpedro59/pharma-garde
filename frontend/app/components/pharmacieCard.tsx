import { Phone, MapPin } from "lucide-react";
import React from "react";
import type { PharmacieOuverte } from "~/lib/types";

interface PharmacieCardProps {
  pharmacie: PharmacieOuverte;
}

const PharmacieCard: React.FC<PharmacieCardProps> = ({ pharmacie }) => {
  // Génération dynamique de l'iframe Google Maps si les coordonnées existent
  const mapEmbedUrl = pharmacie.iframe_url;

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
          <div className="flex items-center justify-between gap-2">
            <h4 className="headline-md font-bold text-stone-900">
              {pharmacie.nom}
            </h4>
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

          <p className="body-sm text-on-surface-variant flex items-start gap-1.5">
            <MapPin size={16} className="shrink-0 mt-0.5 text-stone-500" />
            <span>{pharmacie.adresse_textuelle}</span>
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col md:flex-row gap-3 items-center pt-2">
          <a
            href={`tel:${pharmacie.telephone_1}`}
            className="btn btn-ghost  body-md flex items-center gap-2 font-semibold text-emerald-900 hover:bg-emerald-50 px-3 py-2 rounded-btn"
          >
            <Phone size={16} />
            {pharmacie.telephone_1}
          </a>

          <a
            href={pharmacie.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full px-4 py-2 body-md font-semibold bg-emerald-900 text-white hover:bg-emerald-800  rounded-btn md:w-auto md:ml-auto"
          >
            Voir localisation
          </a>
        </div>
      </div>
    </div>
  );
};

export default PharmacieCard;
