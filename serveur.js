require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); 

// --- Diagnostic au démarrage ---
console.log("\n🚀 --- [SYSTEM CHECK] ---");
console.log(`📡 PORT : ${process.env.PORT || 5000}`);
console.log(`💾 MONGODB : ${process.env.MONGODB_URI ? "DÉTECTÉ ✅" : "MANQUANT ❌"}`);
console.log(`🌐 FRONTEND URL : ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
console.log("--------------------------\n");

if (!process.env.MONGODB_URI) {
    console.error("❌ ERREUR CRITIQUE : MONGODB_URI n'est pas défini dans le fichier .env");
    process.exit(1);
}

const app = express();

// 1. Connexion Base de Données
connectDB(); 

// 2. Middlewares de base
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Ajout de PATCH pour les statuts de commande
    credentials: true
}));

// Configuration pour les images en Base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 3. Utilisation des Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/produits", require("./routes/produit.routes"));
app.use("/api/commandes", require("./routes/commande"));

// 4. Route de test rapide (Health Check)
app.get("/", (req, res) => {
    res.send("API ZE MAIKA opérationnelle 🚀");
});

// 5. Gestion des routes non trouvées (404)
app.use((req, res) => {
    res.status(404).json({ message: "Route inexistante" });
});

// 6. Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ❌ Erreur :`, err.stack);
    
    const statusCode = err.status || 500;
    res.status(statusCode).json({ 
        message: err.message || "Une erreur interne est survenue",
        error: process.env.NODE_ENV === 'development' ? err.stack : {} 
    });
});

// 7. Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur prêt sur : http://localhost:${PORT}`);
});