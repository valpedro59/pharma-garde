import type { Route } from "./+types/home";
import { Hero, SearchForm, Shortcuts } from "~/components";
import { RechercheProvider } from "~/contexts/RechercheContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pharma-garde" },
    {
      name: "description",
      content: "Trouvez une pharmacie de garde ouverte près de vous.",
    },
  ];
}

export default function Home() {
  return (
    <RechercheProvider>
      <div className="relative">
        <div className="relative w-full bg-[url('/bg.webp')] bg-cover bg-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-emerald-100/90 via-slate-50/40 to-transparent  pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <Hero />
            <SearchForm />
          </div>
        </div>
        <Shortcuts />
      </div>
    </RechercheProvider>
  );
}
