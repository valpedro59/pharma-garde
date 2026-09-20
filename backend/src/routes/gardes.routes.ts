import { Router } from "express";
import {
  getPharmaciesOuvertesParArrondissement,
  getPharmaciesOuvertesParVille,
} from "../controllers/gardes.controller.js";

export const gardesRouter = Router();

gardesRouter.get("/recherche", async (req, res) => {
  const arrondissementId = Number(req.query.arrondissement_id);

  if (!arrondissementId) {
    return res
      .status(400)
      .json({ error: "Le paramètre arrondissement_id est obligatoire." });
  }

  try {
    const pharmaciesOuvertes =
      await getPharmaciesOuvertesParArrondissement(arrondissementId);
    res.json(pharmaciesOuvertes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la recherche des pharmacies ouvertes." });
  }
});

gardesRouter.get("/recherche-ville", async (req, res) => {
  const villeId = Number(req.query.ville_id);

  if (!villeId) {
    return res
      .status(400)
      .json({ error: "Le paramètre ville_id est obligatoire." });
  }

  try {
    const pharmaciesOuvertes = await getPharmaciesOuvertesParVille(villeId);
    res.json(pharmaciesOuvertes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la recherche des pharmacies ouvertes." });
  }
});
