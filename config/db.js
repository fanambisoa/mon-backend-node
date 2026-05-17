const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // On récupère l'URI directement ici
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error("L'URI MongoDB est undefined dans config/db.js");
        }

        await mongoose.connect(uri);
        console.log("✅ Connexion à MongoDB Atlas réussie !");
    } catch (error) {
        console.error("❌ Erreur dans config/db.js :", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;