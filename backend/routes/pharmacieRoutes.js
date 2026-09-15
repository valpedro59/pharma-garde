import express from "express";
import {
  afficherToutesPharmacies,
  afficherUnePharmacie,
  ajouterPharmacie,
  modifierPharmacie,
  supprimerPharmacie,
} from "../controllers/pharmacieController.js";

const router = express.Router();

// Query to show data from pg database
router.get("/", afficherToutesPharmacies);
router.get("/:id", afficherUnePharmacie);

router.post("/", ajouterPharmacie);

router.put("/:id", modifierPharmacie);

router.delete("/:id", supprimerPharmacie);

export default router;
