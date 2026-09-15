const URL_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const URL_API = `${URL_BASE}/api/v1`;

/** Erreur enrichie : on conserve le statut HTTP et le message renvoyé par l'API. */
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

/** Le token est stocké en mémoire + localStorage pour survivre au refresh. */
let token: string | null = localStorage.getItem("token");

export const definirToken = (nouveauToken: string | null) => {
  token = nouveauToken;
  if (nouveauToken) {
    localStorage.setItem("token", nouveauToken);
  } else {
    localStorage.removeItem("token");
  }
};

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const { headers: headersPerso, ...reste } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headersPerso as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${URL_API}${endpoint}`, {
    ...reste,
    headers,
  });

  // 204 No Content ou corps vide : rien à parser.
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    // Le backend renvoie { error: "..." } : on récupère ce message utile
    // plutôt que de jeter un "Erreur HTTP 409" opaque.
    const message =
      (data && typeof data === "object" && "error" in data
        ? (data as { error: string }).error
        : null) ?? `Erreur HTTP ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
};

/** Sérialise le body en JSON pour les méthodes qui en ont un. */
const avecBody = (methode: string, body: unknown): RequestInit => ({
  method: methode,
  body: JSON.stringify(body),
});

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, { ...options, ...avecBody("POST", body) }),

  put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, { ...options, ...avecBody("PUT", body) }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

export { URL_BASE, URL_API };
