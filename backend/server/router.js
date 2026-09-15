import express from "express";
import pharmacieRoutes from "../routes/pharmacieRoutes.js";
import gardeRoutes from "../routes/gardeRoutes.js";
import gardeManagementRoutes from "../routes/gardeManagementRoutes.js";

export const router = express.Router();

router.use("/pharmacies", pharmacieRoutes);
// gardeRoutes (recherche, proximite, geographie) doit être monté AVANT
// gardeManagementRoutes, car ce dernier définit GET /gardes/:id qui,
// sinon, intercepterait /gardes/recherche et /gardes/proximite.
router.use(gardeRoutes);
router.use(gardeManagementRoutes);
