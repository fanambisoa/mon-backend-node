const User = require("../models/Users");
const jwt = require("jsonwebtoken");

// --- Fonction Register ---
const register = async (req, res, next) => {
  try {
    const { nom, telephone, password, role } = req.body;
    
    // Validation des champs
    if (!telephone || !password) {
      return res.status(400).json({ message: "Téléphone et mot de passe requis" });
    }

    const existingUser = await User.findOne({ telephone });
    if (existingUser) {
      return res.status(400).json({ message: "Ce numéro est déjà utilisé" });
    }

    // Le hashage du mot de passe doit idéalement être géré dans ton modèle (Users.js) avec un hook .pre('save')
    const newUser = new User({ nom, telephone, password, role });
    await newUser.save();

    return res.status(201).json({ message: "Utilisateur créé avec succès" });

  } catch (err) {
    console.error("Erreur Register détaillée:", err);
    
    // SÉCURITÉ : Si un middleware d'erreur global n'est pas configuré dans ton server.js,
    // appeler next(err) provoquera un crash "next is not a function" ou une page HTML vide.
    // On répond donc directement de manière sécurisée ici.
    return res.status(500).json({ 
      message: "Erreur lors de la création du compte", 
      error: err.message 
    });
  }
};

// --- Fonction Login ---
const login = async (req, res, next) => {
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
    // ⚠️ ALERTE ERREUR 500 COMMUNE : Si "comparePassword" n'est pas défini dans ton fichier models/Users.js,
    // cette ligne fait planter ton serveur instantanément (TypeError: user.comparePassword is not a function).
    if (typeof user.comparePassword !== "function") {
      console.error("💥 ERREUR : La méthode comparePassword n'existe pas sur le modèle User !");
      return res.status(500).json({ message: "Configuration du serveur incomplète (mot de passe)" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // 3. Générer le Token (Vérification de la clé secrète)
    if (!process.env.JWT_SECRET) {
      console.error("💥 ERREUR : La variable d'environnement JWT_SECRET est manquante sur Render !");
      return res.status(500).json({ message: "Erreur de configuration de sécurité du serveur" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 4. Envoyer la réponse
    return res.json({
      token,
      user: {
        id: user._id,
        nom: user.nom,
        role: user.role,
        telephone: user.telephone
      }
    });

  } catch (error) {
    console.error("Erreur Login détaillée:", error);
    return res.status(500).json({ 
      message: "Erreur interne lors de la connexion",
      error: error.message 
    });
  }
};

module.exports = { register, login };