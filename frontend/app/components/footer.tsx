import logo from "/logo.jpeg";
import { Link } from "react-router";
import { Ambulance, MapPin } from "lucide-react";

const Footer = () => {
  const anneeCourante = new Date().getFullYear();

  return (
    <footer className="bg-primary text-on-primary">
      <div className="max-w-7xl mx-auto padding-x py-space-2xl flex flex-col gap-space-xl">
        <div className="flex flex-col gap-space-lg md:flex-row md:justify-between">
          {/* Marque */}
          <div className="flex flex-col gap-space-sm max-w-sm">
            <img
              src={logo}
              alt="Pharmagarde logo"
              width={220}
              height={100}
              className="object-cover rounded-lg"
            />
            <p className="body-sm text-on-primary/80">
              Trouvez en un clic la pharmacie de garde la plus proche, à
              Pointe-Noire et Brazzaville.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-space-xs">
            <h3 className="label-md uppercase tracking-wide text-on-primary/60">
              Navigation
            </h3>
            <Link to="/" className="body-sm hover:underline w-fit">
              Accueil
            </Link>
            <Link to="/auth" className="body-sm hover:underline w-fit">
              Espace administration
            </Link>
          </div>

          {/* Urgence */}
          <div className="flex flex-col gap-space-xs">
            <h3 className="label-md uppercase tracking-wide text-on-primary/60">
              Urgence
            </h3>
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 bg-error text-on-error px-3 py-1.5 rounded-btn label-lg w-fit btn-interaction"
            >
              <Ambulance size={18} />
              SAMU : 112
            </a>
            <p className="body-sm text-on-primary/80 max-w-xs">
              Guichet de garde disponible devant chaque officine répertoriée,
              20h - 8h.
            </p>
          </div>
        </div>

        <div className="h-px bg-on-primary/20" />

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="body-sm text-on-primary/70">
            © {anneeCourante} Pharmagarde. Mis à jour quotidiennement par
            l'Ordre National des Pharmaciens du Congo.
          </p>
          <p className="body-sm text-on-primary/70 flex items-center gap-1">
            <span>Développé par</span>
            <a
              href="https://val-pedro.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-on-primary underline decoration-primary/40 decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              Val Pedro
            </a>
          </p>
          <p className="body-sm text-on-primary/70 flex items-center gap-1">
            <MapPin size={14} />
            Pointe-Noire · Brazzaville
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
