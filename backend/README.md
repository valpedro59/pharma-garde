# Pharma-Garde API (Backend)

API REST développée avec **Node.js**, **Express**, **TypeScript** et **Drizzle ORM** pour la gestion des pharmacies de garde et des zones géographiques.

---

## Technologies utilisées

- **Runtime :** Node.js (v18+)
- **Framework :** Express.js
- **Langage :** TypeScript (Module ESM)
- **ORM :** Drizzle ORM
- **Base de données :** PostgreSQL (Neondb / Supabase / Render Postgres)
- **Gestionnaire de paquets :** pnpm

---

## 📁 Structure du projet

```text
backend/
├── src/
│   ├── config/          # Configurations (Base de données, variables d'env)
│   ├── controllers/     # Contrôleurs pour la logique métier
│   ├── models/              # Schémas Drizzle ORM et migrations
│   │   └── schema.ts
│   ├── routes/          # Définition des endpoints REST
│   ├── app.ts           # Configuration d'Express et middlewares
│   └── index.ts         # Point d'entrée du serveur
├── dist/                # Code compilé JavaScript (généré)
├── drizzle.config.ts    # Configuration Drizzle Kit
├── package.json
└── tsconfig.json
```

## Configuration & Installation

1. Prérequis
   S'assurer d'avoir Node.js (v18+) et pnpm installés sur la machine.

```bash
npm install -g pnpm
```

2. Installation des dépendances
   Se placer dans le dossier backend et exécuter :

```Bash
pnpm install
```

3. Variables d'environnement
   Créer un fichier .env à la racine du dossier backend et y ajouter les clés requises :

Extrait de code
PORT=3000
NODE_ENV=development

### URL de connexion à la base de données PostgreSQL

DATABASE_URL=postgres://utilisateur:motdepasse@hôte:5432/nom_bdd?sslmode=require

### URL du frontend autorisé pour les requêtes CORS

CLIENT_URL=[https://votre-app.netlify.app](https://votre-app.netlify.app)
🗄️ Base de données (Drizzle ORM)
Pour générer et appliquer les migrations à la base de données PostgreSQL :

### Générer les migrations à partir du schéma src/db/schema.ts

pnpm drizzle-kit generate

### Appliquer les migrations sur la BDD en ligne / locale

pnpm drizzle-kit push

## Développement et Build

- Lancer le serveur en mode développement
  ```pnpm dev`
- Compiler le projet en TypeScript (/dist)
  Bash
  ```pnpm build`
- Démarrer le projet compilé en production
  `pnpm start`

- Endpoints API (Aperçu)
  Méthode Endpoint Description
  GET /api/v1/geographie Récupère la liste des villes et arrondissements
  GET /api/v1/pharmacies Récupère la liste des pharmacies
  GET /api/v1/gardes Récupère les pharmacies actuellement de garde

## Déploiement (Render)

Ce backend est configuré pour un déploiement continu sur Render.

Build Command : `pnpm install && pnpm build`

Start Command : `pnpm start` (exécute node dist/index.js)

Variables d'environnement requises sur Render :

DATABASE_URL

CLIENT_URL (Lien du frontend Netlify pour CORS)

## Auteur

Développé par Val Pedro
