import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { LogIn, Lock, Mail } from "lucide-react";
import Button from "~/components/button";
import { useAuth } from "~/contexts/AuthContext";
import { ApiError } from "~/lib/api";

export default function Auth() {
  const { connexion } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  const gererSoumission = async (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    setErreur(null);
    setChargement(true);

    try {
      await connexion(email, motDePasse);
      navigate("/");
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Une erreur est survenue. Réessayez.",
      );
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="bg-emerald-50 flex items-center justify-center padding-section">
      <div className="w-full max-w-md">
        <form
          className="flex flex-col gap-6 bg-white p-8 rounded-xl shadow-2xl"
          onSubmit={gererSoumission}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="bg-emerald-100 p-3 rounded-md">
              <LogIn size={24} className="text-emerald-900" />
            </span>
            <h1 className="headline-lg text-on-surface">
              Espace administration
            </h1>
            <p className="body-md text-on-surface-variant">
              Connectez-vous pour gérer les pharmacies et les gardes.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="label-md flex items-center gap-2 mb-1"
              >
                <Mail size={16} />
                <span>Email</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full h-12 px-space-md rounded-btn bg-emerald-50 label-lg focus:outline-none focus:bg-emerald-100 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="label-md flex items-center gap-2 mb-1"
              >
                <Lock size={16} />
                <span>Mot de passe</span>
              </label>
              <input
                type="password"
                id="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full h-12 px-space-md rounded-btn bg-emerald-50 label-lg focus:outline-none focus:bg-emerald-100 transition-colors"
              />
            </div>
          </div>

          {erreur && (
            <p
              role="alert"
              className="body-sm text-on-error-container bg-error-container px-space-sm py-2 rounded-md"
            >
              {erreur}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={chargement}
            icon={!chargement ? <LogIn size={20} /> : undefined}
          >
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
}

export function meta() {
  return [{ title: "Connexion" }];
}
