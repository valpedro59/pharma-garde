import Button from "./button";
import {
  Ambulance,
  BuildingComplex,
  Funnel,
  LocateFixed,
  Map,
  Search,
} from "lucide-react";

const SearchForm = () => {
  return (
    <section className="padding-section">
      <div className="max-w-7xl flex flex-col gap-3 padding-x padding-y mx-auto">
        <form className="flex flex-col bg-white gap-8 p-8 rounded-xl shadow-2xl">
          <div className="flex gap-2 items-center">
            <span className="bg-emerald-100 p-3 rounded-md">
              <Funnel size={24} />
            </span>
            <div>
              <h3 className="headline-md md: headline-lg">
                Recherche par Zone
              </h3>
              <p className="body-md text-on-surface-variant">
                Selectionnez votre ville ensuite votre quartier
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
                <select className="w-full h-12 pl-space-md pr-10 rounded-btn bg-emerald-50 label-lg  appearance-none focus:outline-none focus:bg-emerald-100 transition-colors cursor-pointer">
                  <option defaultValue={"pn"}>Pointe-Noire</option>
                  <option value="bz">Brazzaville</option>
                </select>
              </div>
            </div>

            {/* Arrondissement Input */}
            <div className="flex-1 w-full">
              <div className="label-md flex j-center gap-2 mb-1">
                <span>
                  <Map />
                </span>
                <span> 2.Arrondissement</span>
              </div>
              <div>
                <select className="w-full h-12 pl-space-md pr-10 rounded-btn bg-emerald-50 label-lg appearance-none focus:outline-none focus:bg-emerald-100 transition-colors cursor-pointer">
                  <option defaultValue={"ar1"}>Lumumba</option>
                  <option value="ar2">Mvou-mvou</option>
                  <option value="ar3">Tie-Tie</option>
                  <option value="ar4">Loandjili</option>
                  <option value="ar5">Mongo-Pokou</option>
                  <option value="ar6">Ngoyo</option>
                </select>
              </div>
            </div>
          </div>

          <Button variant="outline" icon={<LocateFixed />}>
            Me geolocaliser automatiquement
          </Button>
          <Button variant="primary" icon={<Search />}>
            Trouver une pharmacie de garde
          </Button>
          <Button variant="danger" icon={<Ambulance />}>
            Urgence vitale immédiate : SAMU 112
          </Button>
        </form>
      </div>
    </section>
  );
};

export default SearchForm;
