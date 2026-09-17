import express from "express";
import {
  listerGeographie,
  rechercherParArrondissement,
  rechercherParVille,
  rechercherProximite,
} from "../controllers/gardeController.js";
import { validerCordonneesGPS } from "../middlewares/validationGPS.js";

const router = express.Router();

router.get("/geographie", listerGeographie);
router.get("/gardes/recherche", rechercherParArrondissement);
router.get("/gardes/recherche-ville", rechercherParVille);
router.get("/gardes/proximite", validerCordonneesGPS, rechercherProximite);

export default router;
