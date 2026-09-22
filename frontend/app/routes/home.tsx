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
        <Hero />
        <SearchForm />
        <Shortcuts />
      </div>
    </RechercheProvider>
  );
}
