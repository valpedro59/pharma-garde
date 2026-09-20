import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { router } from "./config/router.js";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send(`Environment: ${env.NODE_ENV}`));

app.use("/api/v1", router);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route non trouvée." });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
