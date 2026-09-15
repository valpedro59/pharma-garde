export const validerCordonneesGPS = (req, res, next) => {
  const { lat, lon } = req.query;

  // 1. Vérifier si les paramètres sont présents et pas vides
  if (!lat || !lon) {
    return res.status(400).json({
      error:
        "Données de géolocalisation manquantes. Les paramètres 'lat' et 'lon' sont requis.",
    });
  }

  // 2. Convertir les chaînes en nombres flottants
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  // 3. Vérifier si ce sont des nombres valides (Pas de NaN)
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({
      error: "Les coordonnées GPS fournies doivent être des nombres valides.",
    });
  }

  // 4. Validation des plages géographiques réelles
  if (latitude < -90 || latitude > 90) {
    return res.status(400).json({
      error: "La latitude doit être comprise entre -90 et 90 degrés.",
    });
  }

  if (longitude < -180 || longitude > 180) {
    return res.status(400).json({
      error: "La longitude doit être comprise entre -180 et 180 degrés.",
    });
  }

  // Si tout est valide, on passe au contrôleur ou à la route suivante
  next();
};
