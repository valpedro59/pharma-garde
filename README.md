# Pharma-Garde (Monorepo)

**Pharma-Garde** est une application web moderne permettant aux citoyens d'identifier, localiser et contacter rapidement les pharmacies de garde (jour et nuit) autour de chez eux.

---

## 🎯 Périmètre du Projet

### ✅ INCLUS — Version Initiale (MVP)

- **Tableau des gardes du jour :** Affichage clair des pharmacies de garde selon le type de service (Jour / Nuit / 24h).
- **Fiche pharmacie détaillée :** Nom, quartier/arrondissement, numéros de téléphone direct, horaires.
- **Filtrage géographique :** Recherche et filtrage dynamique par ville et arrondissement.
- **Bouton « Y aller » :** Intégration directe vers **Google Maps** avec géolocalisation et itinéraire.
- **Signalement communautaire :** Option « Fermé / Erreur » pour permettre aux utilisateurs de rapporter une information obsolète ou inexacte.

---

### ❌ EXCLUS — Hors Périmètre (Évolutions Futures)

- 🛒 Achat et réservation de médicaments en ligne
- 💳 Paiement mobile (Mobile Money / Carte bancaire)
- 📦 Gestion et suivi des stocks de médicaments en temps réel
- 🚚 Service de livraison de médicaments à domicile
- 📝 Prise de commande avancée et télé-ordonnance

---

## 🛠️ Architecture & Stack Technique

Le projet est structuré sous forme de **monorepo** géré avec `pnpm` :

### 🎨 Frontend (`/frontend` ou `/app`)

- **Framework :** React 19 / React Router v8
- **Build tool :** Vite
- **Design & Style :** Tailwind CSS v4, Lucide React (Icônes)
- **Hébergement :** Netlify

### ⚙️ Backend (`/backend`)

- **Runtime & Framework :** Node.js (ESM) & Express.js
- **Langage :** TypeScript
- **ORM & BDD :** Drizzle ORM avec PostgreSQL
- **Hébergement :** Render

---

## 📁 Structure du Monorepo

```text
pharma-garde/
├── backend/                  # API REST Express + Drizzle ORM
│   ├── src/
│   │   ├── config/           # Configuration BDD & Variables d'env
│   │   ├── controllers/      # Logique métier
│   │   ├── db/               # Schémas Drizzle ORM & Migrations
│   │   ├── routes/           # Endpoints de l'API REST
│   │   └── index.ts          # Point d'entrée du serveur Node.js
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Application Web React Router / Vite
│   ├── app/
│   │   ├── components/       # Composants UI (cartes, formulaire, navbar...)
│   │   ├── contexts/         # Gestion d'état global (Auth, Recherche)
│   │   ├── lib/              # Client API, types et fonctions utilitaires
│   │   └── routes/           # Vues principales (Accueil, Auth)
│   ├── public/               # Cartes, images et ressources statiques
│   ├── package.json
│   └── vite.config.ts
│
├── package.json              # Fichier racine du monorepo
├── pnpm-workspace.yaml       # Configuration des workspaces pnpm
└── README.md

```

---

## 🚀 Installation & Développement Local

### 1. Prérequis

S'assurer d'avoir **Node.js** (v18+) et **pnpm** installés :

```bash
npm install -g pnpm

```

### 2. Cloner le projet & Installer les dépendances

```bash
git clone [https://github.com/valpedro59/pharma-garde.git](https://github.com/valpedro59/pharma-garde.git)
cd pharma-garde
pnpm install

```

### 3. Configuration des variables d'environnement

#### Côté Backend (`backend/.env`) :

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://utilisateur:motdepasse@hôte:5432/pharma_db?sslmode=require
CLIENT_URL=http://localhost:5173

```

#### Côté Frontend (`frontend/.env`) :

```env
VITE_API_URL=http://localhost:3000

```

---

## 💻 Commandes Principales

Depuis la racine du projet :

```bash
# Lancer le backend et le frontend simultanément
pnpm dev

# Compiler l'ensemble du monorepo pour la production
pnpm build

# Exécuter les migrations Drizzle ORM (Backend)
pnpm --filter backend drizzle-kit push

```

---

## 🌐 Déploiement

- **Backend :** Déployé en continu sur **Render** (`pnpm install && pnpm build` | `pnpm start`).
- **Frontend :** Déployé en continu sur **Netlify** (Variable d'environnement `VITE_API_URL` configurée vers Render).

---

## 👨‍💻 Auteur

Développé et maintenu par **[Val Pedro](https://val-pedro.vercel.app/)**

```

```
