const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// 🔓 Route Publique : Création de compte
router.post("/register", authController.register);

// 🔓 Route Publique : Connexion
router.post("/login", authController.login);

module.exports = router;












