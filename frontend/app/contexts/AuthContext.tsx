import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { api, definirToken } from "~/lib/api";
import type { Utilisateur, ReponseLogin } from "~/lib/types";

interface AuthContextValeur {
  utilisateur: Utilisateur | null;
  estCharge: boolean;
  connexion: (email: string, motDePasse: string) => Promise<void>;
  deconnexion: () => void;
}

const AuthContext = createContext<AuthContextValeur | null>(null);

const CLE_UTILISATEUR = "utilisateur";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  // Le temps de relire localStorage au premier rendu, on évite de flasher
  // un état "déconnecté" à quelqu'un qui a en fait une session valide.
  const [estCharge, setEstCharge] = useState(true);

  useEffect(() => {
    const stocke = localStorage.getItem(CLE_UTILISATEUR);
    if (stocke) {
      try {
        setUtilisateur(JSON.parse(stocke) as Utilisateur);
      } catch {
        localStorage.removeItem(CLE_UTILISATEUR);
      }
    }
    setEstCharge(false);
  }, []);

  const connexion = async (email: string, motDePasse: string) => {
    const reponse = await api.post<ReponseLogin>("/auth/login", {
      email,
      mot_de_passe: motDePasse,
    });

    definirToken(reponse.token);
    localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(reponse.utilisateur));
    setUtilisateur(reponse.utilisateur);
  };

  const deconnexion = () => {
    definirToken(null);
    localStorage.removeItem(CLE_UTILISATEUR);
    setUtilisateur(null);
  };

  return (
    <AuthContext.Provider
      value={{ utilisateur, estCharge, connexion, deconnexion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexte = useContext(AuthContext);
  if (!contexte) {
    throw new Error(
      "useAuth() doit être appelé à l'intérieur d'un <AuthProvider>.",
    );
  }
  return contexte;
}
