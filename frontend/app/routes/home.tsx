import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Hero, Navbar, SearchForm, Shortcuts } from "../components";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="relative bg-emerald-50">
      <Hero />
      <SearchForm />
      <Shortcuts />
    </div>
  );
}
