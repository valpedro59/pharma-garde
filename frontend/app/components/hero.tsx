import { Clock, MapPin, ShieldCheck, Heart } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full py-12 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* --- DIV DU TEXTE (Largeur contrôlée) --- */}
        <div className="w-full md:w-1/2 lg:max-w-xl flex flex-col gap-6">
          {/* Badge "Toujours proche de vous" */}
          <div className="inline-flex items-center gap-2 self-start bg-emerald-100/80 px-3.5 py-1.5 rounded-full text-emerald-900 text-sm font-medium">
            <MapPin size={16} className="text-emerald-700" />
            <span>Toujours proche de vous</span>
          </div>

          {/* Titre Principal */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Trouvez une <span className="text-emerald-700">pharmacie</span> de
            garde près de vous
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Accédez en un clic aux pharmacies ouvertes 24h/24 et 7j/7, et
            d’astreinte nocturne dans votre ville.
          </p>

          {/* Réassurance / Badges du bas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-100/60 rounded-lg text-emerald-800">
                <Clock size={24} />
              </span>
              <div>
                <p className="body-md font-bold text-slate-900">
                  24h/24 – 7j/7
                </p>
                <p className="body-sm text-slate-500">Pharmacies de garde</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-100/60 rounded-lg text-emerald-800">
                <MapPin size={24} />
              </span>
              <div>
                <p className="body-md font-bold text-slate-900">
                  Partout au Congo
                </p>
                <p className="body-sm text-slate-500">Villes et quartiers</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-100/60 rounded-lg text-emerald-800">
                <ShieldCheck size={24} />
              </span>
              <div>
                <p className="body-md font-bold text-slate-900">
                  Fiable & sécurisé
                </p>
                <p className="body-sm text-slate-500">Informations à jour</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
