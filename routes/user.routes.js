const express = require("express");
const router = express.Router();

// données temporaire
const utilisateurs = [
  { id: 1, nom: "Luck", telephone: "0340000000" }
];

// ✅ GET tous les utilisateurs
router.get("/", (req, res) => {
  res.status(200).json(utilisateurs);
});

// ✅ POST ajouter utilisateur
router.post("/", (req, res) => {
  const { nom, telephone } = req.body;

  // 🔍 vérifier champs
  if (!nom || !telephone) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  const nouveauUser = {
    id: utilisateurs.length + 1,
    nom,
    telephone
  };

  utilisateurs.push(nouveauUser);

  res.status(201).json(nouveauUser);
});

module.exports = router;