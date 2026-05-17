const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Récupérer le token du header 'Authorization'
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // On ajoute les infos du user à la requête
    next(); // On passe à l'étape suivante (le contrôleur)
  } catch (err) {
    res.status(403).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = verifyToken;