const User = require("../models/Users");
const jwt = require("jsonwebtoken");

// --- Fonction Register ---
const register = async (req, res, next) => { // Ajout de next ici
  try {
    const { nom, telephone, password, role } = req.body;
    
    // Vérification des champs obligatoires pour éviter une erreur 500
    if (!telephone || !password) {
      return res.status(400).json({ message: "Téléphone et mot de passe requis" });
    }

    const existingUser = await User.findOne({ telephone });
    if (existingUser) {
      return res.status(400).json({ message: "Ce numéro est déjà utilisé" });
    }

    const newUser = new User({ nom, telephone, password, role });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    // Au lieu de res.status(500), on peut passer l'erreur au middleware global
    // ou rester sur res.status(500) si tu n'as pas de gestionnaire d'erreurs global.
    console.error("Erreur Register:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- Fonction Login ---
const login = async (req, res, next) => { // Ajout de next ici
  try {
    const { telephone, password } = req.body;

    if (!telephone || !password) {
      return res.status(400).json({ message: "Identifiants requis" });
    }

    // 1. Trouver l'utilisateur
    const user = await User.findOne({ telephone });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // 2. Vérifier le mot de passe
    // S'assure que comparePassword existe dans le modèle User.js
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // 3. Générer le Token (Vérifie que JWT_SECRET est bien dans ton .env)
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 4. Envoyer la réponse
    res.json({
      token,
      user: {
        id: user._id,
        nom: user.nom,
        role: user.role,
        telephone: user.telephone
      }
    });

  } catch (error) {
    console.error("Erreur Login:", error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

module.exports = { register, login };