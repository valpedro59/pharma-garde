import { query } from "../server/db.js";

/**
 * Colonnes renvoyées pour toute lecture de pharmacie.
 * On évite SELECT * : la colonne `coordonnees` (PostGIS) serait sérialisée
 * en hexadécimal WKB, inexploitable côté client. On projette donc
 * explicitement longitude/latitude via ST_X / ST_Y.
 */
const COLONNES_PHARMACIE = `
  id,
  nom,
  arrondissement_id,
  telephone_1,
  telephone_2,
  adresse_textuelle,
  cree_at,
  ST_X(coordonnees::geometry) AS longitude,
  ST_Y(coordonnees::geometry) AS latitude
`;

/**
 * Valide un couple lat/lon et construit le fragment SQL PostGIS associé.
 * @returns {{ erreur: string } | { sql: string | null, valeurs: number[] }}
 *   `sql` vaut null si aucune coordonnée n'a été fournie (cas légitime).
 */
const construireCoordonnees = (lat, lon, indexDepart) => {
  if (lat === undefined || lon === undefined) {
    return { sql: null, valeurs: [] };
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return { erreur: "Les coordonnées GPS fournies ne sont pas valides." };
  }

  // PostGIS attend (longitude, latitude) dans cet ordre.
  return {
    sql: `ST_SetSRID(ST_MakePoint($${indexDepart}, $${indexDepart + 1}), 4326)`,
    valeurs: [longitude, latitude],
  };
};

/** Traduit les codes d'erreur PostgreSQL en messages exploitables. */
const messageErreurPostgres = (err) => {
  if (err.code === "23503") {
    return "arrondissement_id invalide (arrondissement inexistant).";
  }
  if (err.code === "23505") {
    return "Une pharmacie avec ces informations existe déjà.";
  }
  return null;
};

/**
 * GET /api/v1/pharmacies
 */
export const afficherToutesPharmacies = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT ${COLONNES_PHARMACIE} FROM pharmacies ORDER BY nom ASC;`,
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des pharmacies :", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des pharmacies.",
    });
  }
};

/**
 * GET /api/v1/pharmacies/:id
 */
export const afficherUnePharmacie = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "L'ID doit être un entier positif." });
  }

  try {
    // Une seule requête suffit : si aucune ligne, la pharmacie n'existe pas.
    const { rows } = await query(
      `SELECT ${COLONNES_PHARMACIE} FROM pharmacies WHERE id = $1;`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: `La pharmacie avec l'ID ${id} n'existe pas.`,
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération de la pharmacie :", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération de la pharmacie.",
    });
  }
};

/**
 * POST /api/v1/pharmacies
 */
export const ajouterPharmacie = async (req, res) => {
  const {
    nom,
    arrondissement_id,
    telephone_1,
    telephone_2,
    adresse_textuelle,
    lat,
    lon,
  } = req.body;

  if (!nom || !arrondissement_id || !telephone_1 || !adresse_textuelle) {
    return res.status(400).json({
      error:
        "Veuillez remplir tous les champs obligatoires (nom, arrondissement_id, telephone_1, adresse_textuelle).",
    });
  }

  const params = [
    nom,
    arrondissement_id,
    telephone_1,
    telephone_2 || null,
    adresse_textuelle,
  ];

  // Les coordonnées occuperont $6 et $7 (5 paramètres déjà présents).
  const coordonnees = construireCoordonnees(lat, lon, params.length + 1);
  if (coordonnees.erreur) {
    return res.status(400).json({ error: coordonnees.erreur });
  }
  params.push(...coordonnees.valeurs);

  try {
    const queryText = `
      INSERT INTO pharmacies
        (nom, arrondissement_id, telephone_1, telephone_2, adresse_textuelle, coordonnees)
      VALUES ($1, $2, $3, $4, $5, ${coordonnees.sql ?? "NULL"})
      RETURNING ${COLONNES_PHARMACIE};
    `;

    const { rows } = await query(queryText, params);

    res.status(201).json({
      message: "Pharmacie enregistrée avec succès !",
      pharmacie: rows[0],
    });
  } catch (err) {
    const messageConnu = messageErreurPostgres(err);
    if (messageConnu) {
      return res.status(400).json({ error: messageConnu });
    }
    console.error("Erreur lors de l'insertion de la pharmacie :", err);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la création de la pharmacie." });
  }
};

/**
 * PUT /api/v1/pharmacies/:id
 *
 * ⚠️ Remplacement complet : les champs obligatoires doivent tous être fournis.
 * Si lat/lon sont omis, les coordonnées existantes sont conservées
 * (et non effacées, contrairement à une mise à jour naïve à NULL).
 */
export const modifierPharmacie = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "L'ID doit être un entier positif." });
  }

  const {
    nom,
    arrondissement_id,
    telephone_1,
    telephone_2,
    adresse_textuelle,
    lon,
    lat,
  } = req.body;

  if (!nom || !arrondissement_id || !telephone_1 || !adresse_textuelle) {
    return res.status(400).json({
      error:
        "Les champs nom, arrondissement_id, telephone_1 et adresse_textuelle sont obligatoires.",
    });
  }

  const params = [
    nom,
    arrondissement_id,
    telephone_1,
    telephone_2 || null,
    adresse_textuelle,
    id,
  ];

  // $6 est pris par `id` : les coordonnées commencent donc à $7.
  const coordonnees = construireCoordonnees(lat, lon, params.length + 1);
  if (coordonnees.erreur) {
    return res.status(400).json({ error: coordonnees.erreur });
  }
  params.push(...coordonnees.valeurs);

  try {
    const queryText = `
      UPDATE pharmacies
      SET
        nom = $1,
        arrondissement_id = $2,
        telephone_1 = $3,
        telephone_2 = $4,
        adresse_textuelle = $5,
        coordonnees = ${coordonnees.sql ?? "coordonnees"}
      WHERE id = $6
      RETURNING ${COLONNES_PHARMACIE};
    `;

    const { rows } = await query(queryText, params);

    // Pas de vérification préalable : si aucune ligne n'est retournée,
    // c'est que l'ID n'existe pas. Une seule requête au lieu de deux.
    if (rows.length === 0) {
      return res.status(404).json({
        error: `Mise à jour impossible. La pharmacie avec l'ID ${id} n'existe pas.`,
      });
    }

    res.status(200).json({
      message: "Pharmacie mise à jour avec succès !",
      pharmacie: rows[0],
    });
  } catch (error) {
    const messageConnu = messageErreurPostgres(error);
    if (messageConnu) {
      return res.status(400).json({ error: messageConnu });
    }
    console.error("Erreur lors de la modification de la pharmacie :", error);
    res.status(500).json({
      error: "Erreur serveur lors de la mise à jour de la pharmacie.",
    });
  }
};

/**
 * DELETE /api/v1/pharmacies/:id
 *
 * Les gardes et horaires liés sont nettoyés automatiquement
 * grâce aux ON DELETE CASCADE des clés étrangères.
 */
export const supprimerPharmacie = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "L'ID doit être un entier positif." });
  }

  try {
    // RETURNING permet de savoir en une seule requête si la ligne existait.
    const { rows } = await query(
      "DELETE FROM pharmacies WHERE id = $1 RETURNING id, nom;",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: `Suppression impossible. La pharmacie avec l'ID ${id} n'existe pas.`,
      });
    }

    res.status(200).json({
      message: `La pharmacie "${rows[0].nom}" (ID: ${id}) a été supprimée avec succès !`,
    });
  } catch (err) {
    console.error("Erreur lors de la suppression de la pharmacie :", err);
    res.status(500).json({
      error: "Erreur serveur lors de la suppression de la pharmacie.",
    });
  }
};
