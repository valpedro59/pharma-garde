import { Router } from "express";
import { getArborescenceGeographique } from "../controllers/pharmacies.controller.js";
import { creerSignalement } from "../controllers/signalements.controller.js";

export const pharmaciesRouter = Router();

pharmaciesRouter.get("/geographie", async (req, res) => {
  try {
    const zones = await getArborescenceGeographique();
    res.json(zones);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des zones géographiques.",
    });
  }
});

/**
 * POST /pharmacies/:id/signalements
 * US5 : un utilisateur signale qu'une pharmacie censée être de garde est
 * en réalité fermée. Pas d'auth ici — la protection anti-spam basique
 * (un signalement par pharmacie par navigateur) est gérée côté frontend
 * via localStorage, en attendant un vrai système de comptes.
 */
pharmaciesRouter.post("/pharmacies/:id/signalements", async (req, res) => {
  const pharmacieId = Number(req.params.id);

  if (!Number.isInteger(pharmacieId) || pharmacieId < 1) {
    return res.status(400).json({ error: "L'ID doit être un entier positif." });
  }

  try {
    const signalement = await creerSignalement(pharmacieId);

    if (!signalement) {
      return res.status(404).json({
        error: `La pharmacie avec l'ID ${pharmacieId} n'existe pas.`,
      });
    }

    res.status(201).json({ message: "Signalement enregistré. Merci !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur serveur lors de l'enregistrement du signalement.",
    });
  }
});
