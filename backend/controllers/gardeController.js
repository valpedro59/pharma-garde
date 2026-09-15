import { query } from "../server/db.js";

export const listerGeographie = async (req, res) => {
  try {
    const queryText = `
      SELECT 
        v.id AS ville_id, v.nom AS ville_nom,
        a.id AS arrondissement_id, a.nom AS arrondissement_nom
      FROM villes v
      LEFT JOIN arrondissements a ON v.id = a.ville_id
      ORDER BY v.nom, a.nom;
    `;
    const { rows } = await query(queryText);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des zones géographiques.",
    });
  }
};

/**
 * Rechercher les pharmacies ouvertes ou de garde par Arrondissement
 */
export const rechercherParArrondissement = async (req, res) => {
  const { arrondissement_id } = req.query;

  if (!arrondissement_id) {
    return res
      .status(400)
      .json({ error: "Le paramètre arrondissement_id est obligatoire." });
  }

  try {
    const queryText = `
      SELECT DISTINCT ON (p.id)
        p.id, 
        p.nom, 
        p.telephone_1, 
        p.telephone_2, 
        p.adresse_textuelle,
        ST_X(p.coordonnees::geometry) AS longitude,
        ST_Y(p.coordonnees::geometry) AS latitude,
        CASE 
          WHEN g.id IS NOT NULL THEN 'GARDE_' || g.type_garde
          ELSE 'OUVERTURE_NORMALE'
        END AS statut_actuel
      FROM pharmacies p
      LEFT JOIN gardes g ON p.id = g.pharmacie_id 
        AND NOW() BETWEEN g.date_debut AND g.date_fin
      LEFT JOIN horaires_reguliers h ON p.id = h.pharmacie_id 
        AND h.jour_semaine = EXTRACT(ISODOW FROM NOW()) % 7
        AND CURRENT_TIME BETWEEN h.heure_ouverture AND h.heure_fermeture
      WHERE p.arrondissement_id = $1
        AND (g.id IS NOT NULL OR h.id IS NOT NULL)
      -- ORDER BY déterministe : une pharmacie en GARDE_* est toujours
      -- affichée avant une simple OUVERTURE_NORMALE ('G' < 'O' en ASC)
      ORDER BY p.id, statut_actuel ASC;
    `;

    const { rows } = await query(queryText, [arrondissement_id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la recherche des pharmacies ouvertes." });
  }
};

/**
 * Géolocalisation par GPS (rayon max 10km) — gardes actives + ouvertures normales,
 * triées par distance croissante.
 */
export const rechercherProximite = async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const queryText = `
      SELECT * FROM (
        SELECT DISTINCT ON (p.id)
          p.id, 
          p.nom, 
          p.telephone_1, 
          p.telephone_2,
          p.adresse_textuelle,
          ST_X(p.coordonnees::geometry) AS longitude,
          ST_Y(p.coordonnees::geometry) AS latitude,
          ST_Distance(p.coordonnees, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) AS distance_metres,
          CASE 
            WHEN g.id IS NOT NULL THEN 'GARDE_' || g.type_garde
            ELSE 'OUVERTURE_NORMALE'
          END AS statut_actuel
        FROM pharmacies p
        LEFT JOIN gardes g ON p.id = g.pharmacie_id 
          AND NOW() BETWEEN g.date_debut AND g.date_fin
        LEFT JOIN horaires_reguliers h ON p.id = h.pharmacie_id 
          AND h.jour_semaine = EXTRACT(ISODOW FROM NOW()) % 7
          AND CURRENT_TIME BETWEEN h.heure_ouverture AND h.heure_fermeture
        WHERE 
          (g.id IS NOT NULL OR h.id IS NOT NULL)
          AND ST_DWithin(p.coordonnees, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 10000)
        -- ORDER BY déterministe : priorité à GARDE_* sur OUVERTURE_NORMALE
        -- quand une pharmacie a les deux à la fois ('G' < 'O' en ASC)
        ORDER BY p.id, statut_actuel ASC
      ) AS resultats
      ORDER BY distance_metres ASC;
    `;

    // Rappel : PostGIS prend l'ordre (Longitude, Latitude) -> ($1 = lon, $2 = lat)
    const { rows } = await query(queryText, [lon, lat]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors du calcul de proximité GPS." });
  }
};
