import express from "express";
import {
  creerGarde,
  listerGardes,
  obtenirGarde,
  modifierGarde,
  supprimerGarde,
  genererRotation,
} from "../controllers/gardeManagementController.js";

const router = express.Router();

// Route littérale déclarée avant /gardes/:id pour éviter tout conflit
router.post("/gardes/rotation", genererRotation);

router.post("/gardes", creerGarde);
router.get("/gardes", listerGardes);
router.get("/gardes/:id", obtenirGarde);
router.put("/gardes/:id", modifierGarde);
router.delete("/gardes/:id", supprimerGarde);

export default router;
