/**
 * Configuration des URLs de l'API.
 * Si VITE_API_URL est définie (ex: sur Netlify en prod), elle sera utilisée.
 * Sinon, l'URL bascule par défaut sur l'environnement de dev local.
 */
const URL_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const URL_API = `${URL_BASE}/api/v1`;

/**
 * Classe d'erreur personnalisée pour l'API.
 * Permet de capturer le statut HTTP (400, 401, 404, 500...) ainsi que le
 * corps complet de la réponse d'erreur renvoyé par le serveur Express.
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Gestion du jeton d'authentification JWT.
 * Le token est conservé en mémoire (`token`) pour un accès rapide.
 * Une protection `typeof window !== "undefined"` est ajoutée pour éviter les plantages
 * lors de l'exécution côté serveur (SSR / React Router) où `localStorage` n'existe pas.
 */
let token: string | null =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

/**
 * Permet de définir ou supprimer le jeton JWT.
 * Synchronise l'état en mémoire et le stockage local du navigateur (localStorage).
 */
export const definirToken = (nouveauToken: string | null) => {
  token = nouveauToken;

  // Si le code s'exécute sur le serveur (SSR), on s'arrête ici.
  if (typeof window === "undefined") return;

  if (nouveauToken) {
    localStorage.setItem("token", nouveauToken);
  } else {
    localStorage.removeItem("token");
  }
};

/**
 * Moteur principal de requêtes HTTP (wrapper autour de la fonction native `fetch`).
 *
 * @template T Type de données attendu en retour de l'API.
 * @param endpoint Route de l'API à appeler (ex: "/geographie").
 * @param options Options standards de l'API Fetch (method, headers, body, etc.).
 */
const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  // On sépare les en-têtes personnalisés du reste des options
  // afin d'éviter qu'ils ne soient écrasés par inadvertance.
  const { headers: headersPerso, ...reste } = options;

  // Définition des en-têtes par défaut : communication au format JSON
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headersPerso as Record<string, string>),
  };

  // Si un jeton JWT est actif, on l'injecte dans le header d'autorisation
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Exécution de la requête HTTP vers le backend
  const response = await fetch(`${URL_API}${endpoint}`, {
    ...reste,
    headers,
  });

  // Cas spécial HTTP 204 (No Content) : succès mais aucun contenu à décoder dans le corps
  if (response.status === 204) {
    return undefined as T;
  }

  // Vérification du type de contenu renvoyé par le serveur (JSON ou texte)
  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  // Traitement des erreurs renvoyées par le backend (statuts HTTP 4xx et 5xx)
  if (!response.ok) {
    // Si le serveur a renvoyé un message d'erreur structuré (ex: { error: "Message" }),
    // on l'extrait. Sinon, on génère un message d'erreur générique basé sur le statut HTTP.
    const message =
      (data && typeof data === "object" && "error" in data
        ? (data as { error: string }).error
        : null) ?? `Erreur HTTP ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  // Renvoie des données typées en cas de succès (statuts HTTP 2xx)
  return data as T;
};

/**
 * Utilitaire pour formater les requêtes HTTP qui nécessitent un corps (body) au format JSON.
 */
const avecBody = (methode: string, body: unknown): RequestInit => ({
  method: methode,
  body: JSON.stringify(body),
});

/**
 * Client API exporté sous forme d'un objet exposant les raccourcis HTTP usuels.
 */
export const api = {
  /** Requête HTTP GET */
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  /** Requête HTTP POST (avec sérialisation JSON automatique du body) */
  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, { ...options, ...avecBody("POST", body) }),

  /** Requête HTTP PUT (avec sérialisation JSON automatique du body) */
  put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, { ...options, ...avecBody("PUT", body) }),

  /** Requête HTTP DELETE */
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

// Export des constantes d'URL pour une utilisation ponctuelle ailleurs dans l'application
export { URL_BASE, URL_API };
