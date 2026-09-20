import { Router } from "express";
import { getArborescenceGeographique } from "../controllers/pharmacies.controller.js";

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
