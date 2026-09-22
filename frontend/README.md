# Pharma-Garde (Frontend)

Application web interactive développée avec **React Router v8**, **React 19**, **Tailwind CSS v4** et **Typescript** pour la recherche et la localisation des pharmacies de garde.

## Technologies utilisées

- **Framework & Routing :** [React Router v8](https://reactrouter.com/) (avec React 19)
- **Bundler :** [Vite v8](https://vitejs.dev/)
- **Style :** [Tailwind CSS v4](https://tailwindcss.com/)
- **Cartographie :** [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Icônes :** [Lucide React](https://lucide.dev/)
- **Langage :** [TypeScript](https://www.typescriptlang.org/)
- **Gestionnaire de paquets :** [pnpm](https://pnpm.io/)

## 📁 Structure du projet

````text
├── app/
│   ├── app.css                 # Feuille de style globale & configurations Tailwind CSS
│   ├── components/             # Composants UI réutilisables
│   │   ├── button.tsx
│   │   ├── footer.tsx
│   │   ├── hero.tsx
│   │   ├── navbar.tsx
│   │   ├── pharmacieCard.tsx   # Carte de présentation d'une pharmacie
│   │   ├── searchForm.tsx     # Formulaire de recherche
│   │   ├── shortcuts.tsx      # Raccourcis de recherche rapide
│   │   └── index.ts
│   ├── contexts/               # Contextes React (Gestion d'état global)
│   │   ├── AuthContext.tsx     # Gestion de l'authentification
│   │   └── RechercheContext.tsx # État de la recherche des pharmacies
│   ├── lib/                    # Helpers, utilitaires et appels API
│   │   ├── api.ts              # Configuration des requêtes API
│   │   ├── constants.ts        # Constantes globales
│   │   ├── pharmacies.ts       # Services liés aux pharmacies
│   │   └── types.ts            # Définitions TypeScript
│   ├── root.tsx                # Composant racine de l'application
│   ├── routes/                 # Pages / Vues de l'application
│   │   ├── auth.tsx            # Page d'authentification
│   │   └── home.tsx            # Page d'accueil / Recherche
│   └── routes.ts               # Configuration des routes React Router
├── public/                     # Fichiers statiques et images
│   ├── bzv.webp
│   ├── logo.jpeg
│   └── pnr.webp
├── package.json
├── react-router.config.ts
├── tsconfig.json
└── vite.config.ts
## Getting Started

### Installation

Installer les dependances:

```bash
pnpm install
````

### Developpement

Demarrer le serveur:

```bash
pnpm run dev
```

Votre application sera disponible sur `http://localhost:5173`.

## Build pour la Production

Creer un build:

```bash
pnpm run build
```

## Deploiement

### Netlify

Ce projet est configuré pour être déployé facilement sur Netlify.

Connectez votre dépôt Git à Netlify.

Définissez les paramètres de build :

Build Command : pnpm build

Publish directory : build/client (ou selon votre configuration de sortie React Router)

Ajoutez la variable d'environnement sur Netlify dans Site configuration > Environment variables :

Key: VITE_API_URL

Value: https://votre-backend.onrender.com

## Auteur

Développé par Val Pedro
