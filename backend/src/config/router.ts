import express from "express";
import { pharmaciesRouter } from "../routes/pharmacies.routes.js";
import { gardesRouter } from "../routes/gardes.routes.js";

export const router = express.Router();

router.use(pharmaciesRouter);
router.use("/gardes", gardesRouter);
