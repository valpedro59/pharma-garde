import pool, { query } from "../server/db.js";

const TYPES_GARDE_VALIDES = ["VOLET_OUVERT", "VOLET_FERME"];

const messageErreurPostgres = (err) => {
  if (err.code === "23P01") {
    return "Cette pharmacie a déjà une garde qui chevauche cette période.";
  }
  if (err.code === "23503") {
    return "pharmacie_id invalide (pharmacie inexistante).";
  }
  if (err.code === "23514") {
    return "date_fin doit être postérieure à date_debut.";
  }
  return null;
};

/**
 * POST /api/gardes
 * Création manuelle d'une garde
 */
export const creerGarde = async (req, res) => {
  const { pharmacie_id, date_debut, date_fin, type_garde } = req.body;

  if (!pharmacie_id || !date_debut || !date_fin || !type_garde) {
    return res.status(400).json({
      error:
        "pharmacie_id, date_debut, date_fin et type_garde sont obligatoires.",
    });
  }

  if (!TYPES_GARDE_VALIDES.includes(type_garde)) {
    return res.status(400).json({
      error: `type_garde invalide. Valeurs acceptées : ${TYPES_GARDE_VALIDES.join(", ")}.`,
    });
  }

  if (new Date(date_fin) <= new Date(date_debut)) {
    return res
      .status(400)
      .json({ error: "date_fin doit être postérieure à date_debut." });
  }

  try {
    const { rows } = await query(
      `INSERT INTO gardes (pharmacie_id, date_debut, date_fin, type_garde)
       VALUES ($1, $2, $3, $4)
       RETURNING id, pharmacie_id, date_debut, date_fin, type_garde;`,
      [pharmacie_id, date_debut, date_fin, type_garde],
    );
    res
      .status(201)
      .json({ message: "Garde créée avec succès.", garde: rows[0] });
  } catch (err) {
    const messageConnu = messageErreurPostgres(err);
    if (messageConnu) {
      return res
        .status(err.code === "23P01" ? 409 : 400)
        .json({ error: messageConnu });
    }
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la création de la garde." });
  }
};

/**
 * GET /api/gardes?pharmacie_id=&arrondissement_id=&du=&au=
 * Liste des gardes, filtrable par pharmacie, arrondissement ou période
 */
export const listerGardes = async (req, res) => {
  const { pharmacie_id, arrondissement_id, du, au } = req.query;

  const conditions = [];
  const params = [];

  if (pharmacie_id) {
    params.push(pharmacie_id);
    conditions.push(`g.pharmacie_id = $${params.length}`);
  }
  if (arrondissement_id) {
    params.push(arrondissement_id);
    conditions.push(`p.arrondissement_id = $${params.length}`);
  }
  if (du) {
    params.push(du);
    conditions.push(`g.date_fin >= $${params.length}`);
  }
  if (au) {
    params.push(au);
    conditions.push(`g.date_debut <= $${params.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  try {
    const queryText = `
      SELECT g.id, g.pharmacie_id, p.nom AS pharmacie_nom, g.date_debut, g.date_fin, g.type_garde
      FROM gardes g
      JOIN pharmacies p ON p.id = g.pharmacie_id
      ${whereClause}
      ORDER BY g.date_debut ASC;
    `;
    const { rows } = await query(queryText, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération des gardes." });
  }
};

/**
 * GET /api/gardes/:id
 */
export const obtenirGarde = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await query(
      `SELECT g.id, g.pharmacie_id, p.nom AS pharmacie_nom, g.date_debut, g.date_fin, g.type_garde
       FROM gardes g
       JOIN pharmacies p ON p.id = g.pharmacie_id
       WHERE g.id = $1;`,
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Garde introuvable." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération de la garde." });
  }
};

/**
 * PUT /api/gardes/:id
 * Mise à jour partielle (les champs omis conservent leur valeur actuelle)
 */
export const modifierGarde = async (req, res) => {
  const { id } = req.params;
  const { pharmacie_id, date_debut, date_fin, type_garde } = req.body;

  if (type_garde && !TYPES_GARDE_VALIDES.includes(type_garde)) {
    return res.status(400).json({
      error: `type_garde invalide. Valeurs acceptées : ${TYPES_GARDE_VALIDES.join(", ")}.`,
    });
  }

  if (date_debut && date_fin && new Date(date_fin) <= new Date(date_debut)) {
    return res
      .status(400)
      .json({ error: "date_fin doit être postérieure à date_debut." });
  }

  try {
    const { rows } = await query(
      `UPDATE gardes
       SET pharmacie_id = COALESCE($1, pharmacie_id),
           date_debut = COALESCE($2, date_debut),
           date_fin = COALESCE($3, date_fin),
           type_garde = COALESCE($4, type_garde)
       WHERE id = $5
       RETURNING id, pharmacie_id, date_debut, date_fin, type_garde;`,
      [pharmacie_id, date_debut, date_fin, type_garde, id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Garde introuvable." });
    }

    res.json({ message: "Garde mise à jour avec succès.", garde: rows[0] });
  } catch (err) {
    const messageConnu = messageErreurPostgres(err);
    if (messageConnu) {
      return res
        .status(err.code === "23P01" ? 409 : 400)
        .json({ error: messageConnu });
    }
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la mise à jour de la garde." });
  }
};

/**
 * DELETE /api/gardes/:id
 */
export const supprimerGarde = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await query(
      `DELETE FROM gardes WHERE id = $1 RETURNING id;`,
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Garde introuvable." });
    }
    res.json({ message: "Garde supprimée avec succès." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la suppression de la garde." });
  }
};

/**
 * POST /api/gardes/rotation
 * Génère automatiquement une série de gardes en répartissant une liste de
 * pharmacies à tour de rôle sur une période donnée.
 *
 * Body attendu :
 * {
 *   "pharmacie_ids": [3, 7, 12],
 *   "date_debut": "2026-09-10",
 *   "date_fin": "2026-09-20",
 *   "duree_jours": 1,          // durée de chaque tour (1 = rotation quotidienne)
 *   "heure_debut": "20:00",    // heure de début de chaque garde
 *   "heure_fin": "06:00",      // heure de fin (peut passer minuit)
 *   "type_garde": "VOLET_FERME"
 * }
 *
 * Chaque créneau est inséré individuellement (avec SAVEPOINT) : un
 * chevauchement sur une pharmacie n'annule pas le reste de la génération,
 * il est simplement remonté dans "erreurs".
 */
export const genererRotation = async (req, res) => {
  const {
    pharmacie_ids,
    date_debut,
    date_fin,
    duree_jours = 1,
    heure_debut = "00:00",
    heure_fin = "00:00",
    type_garde = "VOLET_FERME",
  } = req.body;

  if (!Array.isArray(pharmacie_ids) || pharmacie_ids.length === 0) {
    return res
      .status(400)
      .json({ error: "pharmacie_ids doit être un tableau non vide." });
  }
  if (!date_debut || !date_fin) {
    return res
      .status(400)
      .json({ error: "date_debut et date_fin sont obligatoires." });
  }
  if (!TYPES_GARDE_VALIDES.includes(type_garde)) {
    return res.status(400).json({
      error: `type_garde invalide. Valeurs acceptées : ${TYPES_GARDE_VALIDES.join(", ")}.`,
    });
  }
  if (!Number.isInteger(duree_jours) || duree_jours < 1) {
    return res
      .status(400)
      .json({ error: "duree_jours doit être un entier >= 1." });
  }

  const debutPlanning = new Date(date_debut);
  const finPlanning = new Date(date_fin);

  if (
    isNaN(debutPlanning) ||
    isNaN(finPlanning) ||
    finPlanning <= debutPlanning
  ) {
    return res.status(400).json({ error: "Plage de dates invalide." });
  }

  const [hD, mD] = heure_debut.split(":").map(Number);
  const [hF, mF] = heure_fin.split(":").map(Number);

  if ([hD, mD, hF, mF].some((n) => Number.isNaN(n))) {
    return res
      .status(400)
      .json({ error: "heure_debut / heure_fin doivent être au format HH:MM." });
  }

  // 1. Construction des créneaux en mémoire (round-robin sur pharmacie_ids)
  const creneaux = [];
  let curseur = new Date(debutPlanning);
  let index = 0;

  while (curseur < finPlanning) {
    const periodeDebut = new Date(curseur);
    periodeDebut.setHours(hD, mD, 0, 0);

    const periodeFin = new Date(curseur);
    periodeFin.setDate(periodeFin.getDate() + duree_jours);
    periodeFin.setHours(hF, mF, 0, 0);

    creneaux.push({
      pharmacie_id: pharmacie_ids[index % pharmacie_ids.length],
      date_debut: periodeDebut,
      date_fin: periodeFin,
    });

    curseur.setDate(curseur.getDate() + duree_jours);
    index++;
  }

  // 2. Insertion créneau par créneau, avec SAVEPOINT pour isoler les échecs
  const crees = [];
  const erreurs = [];
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const creneau of creneaux) {
      try {
        await client.query("SAVEPOINT sp_garde");
        const { rows } = await client.query(
          `INSERT INTO gardes (pharmacie_id, date_debut, date_fin, type_garde)
           VALUES ($1, $2, $3, $4)
           RETURNING id, pharmacie_id, date_debut, date_fin, type_garde;`,
          [
            creneau.pharmacie_id,
            creneau.date_debut,
            creneau.date_fin,
            type_garde,
          ],
        );
        crees.push(rows[0]);
        await client.query("RELEASE SAVEPOINT sp_garde");
      } catch (err) {
        await client.query("ROLLBACK TO SAVEPOINT sp_garde");
        erreurs.push({
          pharmacie_id: creneau.pharmacie_id,
          date_debut: creneau.date_debut,
          date_fin: creneau.date_fin,
          raison: messageErreurPostgres(err) || "Erreur lors de l'insertion.",
        });
      }
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erreur serveur lors de la génération de la rotation." });
  } finally {
    client.release();
  }

  res.status(201).json({
    message: `${crees.length} garde(s) créée(s), ${erreurs.length} en erreur.`,
    crees,
    erreurs,
  });
};
