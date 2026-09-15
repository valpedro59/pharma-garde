import Button from "./button";
import pnr from "/pnr.webp";
import bzv from "/bzv.webp";
import { ArrowUpDown } from "lucide-react";

const Shortcuts = () => {
  return (
    <section className="bg-white padding-section">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        <div className="flex items-center justify-between pb-space-xs">
          <h2 className="headline-md  text-on-surface">Villes principales</h2>
          <span className="label-sm text-on-surface-variant font-bold md:label-md">
            1 clic rapide
          </span>
        </div>

        <div className="mb-4">
          <div className="flex flex-col justify-center gap-4 items-center md:flex-row">
            {/* Card 1 */}
            <div className="flex flex-1 w-full flex-col  justify-center gap-4 p-4 rounded-xl shadow-sm text-center hover:bg-emerald-50 transition-colors group">
              {/* top */}
              <div className="flex justify-between items-start">
                <div className="flex items-center  gap-2">
                  <span className="p-3 bg-slate-100 rounded-md font-semibold">
                    PNR
                  </span>
                  <div className=" flex flex-col items-start">
                    <h3 className="headline-md">Pointe-Noire</h3>
                    <p className="body-sm">Capitale economique . 6 arr</p>
                  </div>
                </div>
                <div className="p-1 bg-emerald-200 rounded-md label-sm">
                  nombre de garde
                </div>
              </div>

              {/* middle */}
              <div>
                <img
                  src={pnr}
                  alt="Image Pointe-noire"
                  className="w-full object-cover rounded-md h-56"
                />
              </div>

              <Button variant="ghost">Consulter les gardes</Button>
            </div>

            {/* Card  2 */}
            <div className="flex flex-1 w-full flex-col  justify-center gap-4 p-4 rounded-xl shadow-sm text-center hover:bg-emerald-50  transition-colors group">
              {/* top */}
              <div className="flex justify-between items-start">
                <div className="flex items-center  gap-2">
                  <span className="p-3 bg-emerald-100 rounded-md font-semibold">
                    BZV
                  </span>
                  <div className=" flex flex-col items-start">
                    <h3 className="headline-md">Brazzaville</h3>
                    <p className="body-sm">Capitale politique . 9 arr</p>
                  </div>
                </div>
                <div className="p-1 bg-emerald-200 rounded-md label-sm">
                  nombre de garde
                </div>
              </div>

              {/* middle */}
              <div>
                <img
                  src={bzv}
                  alt="Image Pointe-noire"
                  className="w-full object-cover rounded-md h-56"
                />
              </div>

              <Button variant="ghost">Consulter les gardes</Button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div></div>
          <div className="bg-emerald-50 rounded-xl p-space-md flex items-center gap-space-sm">
            <h3 className="headline-md text-on-surface">
              Permanence 20h00 - 08h00
            </h3>
            <p className="body-sm text-on-surface-variant leading-relaxed md:label-md">
              Pour les ordonnances de nuit, un guichet de garde ou une sonnette
              de nuit sécurisée est disponible devant chaque pharmacie
              répertoriée.
            </p>
          </div>
        </div>

        <div className="px-gutter-mobile pt-space-xs pb-space-lg text-center">
          <div className="inline-flex items-center justify-center gap-1.5 px-space-md py-1.5 rounded-full bg-slate-300text-on-surface-variant label-sm md:label-md">
            <span>
              <ArrowUpDown />
            </span>
            <span>Fonctionne hors-ligne et en faible débit (2G/3G)</span>
          </div>
          <div className="pt-2 text-center">
            <p className="body-sm text-on-surface-variant opacity-75 md:body-md">
              Mis à jour quotidiennement par l'Ordre National des Pharmaciens du
              Congo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shortcuts;
