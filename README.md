# 💊 Pharma-Garde (Monorepo)

**Pharma-Garde** est une application web moderne conçue pour permettre aux habitants de **Brazzaville** et **Pointe-Noire** d'identifier, localiser et contacter rapidement la pharmacie de garde (jour et nuit) ouverte la plus proche.

---

## 🎯 Périmètre du Projet (Backlog MoSCoW)

### ✅ INCLUS — MVP (MUST & SHOULD)

- **Tableau des gardes du jour (US1) :** Affichage clair des pharmacies de garde selon le statut d'ouverture (Jour / Nuit / 24h).
- **Filtrage géographique (US2) :** Recherche et filtrage dynamique par ville (Brazzaville, Pointe-Noire) et par arrondissement (Bacongo, Moungali, Poto-Poto, etc.).
- **Appel téléphonique direct (US3) :** Bouton cliquable pour joindre l'officine directement (`tel:`) et vérifier la disponibilité d'un médicament avant de se déplacer.
- **Accès à l'itinéraire GPS (US4) :** Bouton « Y aller » redirigeant directement vers **Google Maps** avec les coordonnées de la pharmacie.
- **Signalement communautaire (US5) :** Option « Signaler comme fermée » permettant d'avertir les autres utilisateurs si une pharmacie de garde est exceptionnellement close (affichage d'un badge d'avertissement orange si le seuil de signalements est atteint).

---

### ❌ EXCLUS — Hors Périmètre (COULD & Évolutions Futures)

- 🛒 **US6 — Système de commande et paiement à distance :** Réservation, panier et paiement en ligne (Mobile Money / Carte bancaire).
- 📦 **Gestion des stocks en temps réel :** Consultation directe de la disponibilité des médicaments.
- 🚚 **Service de livraison à domicile :** Prise en charge et transport des médicaments.
- 📝 **Télé-ordonnance et messagerie instantanée.**

---

## 🛠️ Architecture & Stack Technique

Le projet est structuré sous forme de **monorepo** géré avec `pnpm` :

### 🎨 Frontend (`/frontend` ou `/app`)

- **Framework :** React 19 / React Router v8
- **Build tool :** Vite
- **Design & Style :** Tailwind CSS v4, Lucide React (Icônes)
- **Cartographie :** Google Maps Embed / Leaflet
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
│   │   ├── config/           # Configuration BDD, variables d'env & signalements.ts
│   │   ├── controllers/      # Logique métier (gardes.controller.ts, signalements.controller.ts...)
│   │   ├── models/           # Schémas Drizzle ORM (schema.ts)
│   │   ├── routes/           # Endpoints de l'API REST
│   │   └── index.ts          # Point d'entrée du serveur Node.js
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Application Web React Router / Vite
│   ├── app/
│   │   ├── components/       # Composants UI (PharmacieCard, SearchForm, Navbar...)
│   │   ├── contexts/         # Gestion d'état global (Auth, Recherche)
│   │   ├── lib/              # Client API, types et fonctions utilitaires
│   │   └── routes/           # Vues principales (Home, Auth)
│   ├── public/               # Ressources statiques et images
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
# Lancer le backend et le frontend simultanément en dev
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

Développé et maintenu par **[Val Pedro](https://val-pedro.vercel.app)**
