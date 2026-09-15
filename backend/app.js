import express from "express";
import cors from "cors";
import "dotenv/config";
import "./server/db.js"; // initialise la connexion + log de vérification
import { router } from "./server/router.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send({ message: "API lancé." }));

// le router
app.use("/api/v1", router);

// 404 - route non trouvée
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée." });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur." });
});

export default app;