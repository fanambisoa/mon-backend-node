const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
// Importe ton middleware de vérification (à créer ou importer si existant)
// const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// 🟢 GET : Récupérer tous les produits (Public)
router.get("/", async (req, res) => {
    try {
        const produits = await Product.find().sort({ createdAt: -1 });
        res.json(produits);
    } catch (err) {
        res.status(500).json({ message: "Impossible de récupérer les produits" });
    }
});

// 🔵 POST : Ajouter un produit (Admin seulement)
router.post("/", async (req, res) => {
    try {
        const { nom, prix, image, categorie, description, stock } = req.body;

        // Validation simple côté serveur
        if (!nom || !prix || !categorie) {
            return res.status(400).json({ message: "Nom, prix et catégorie sont obligatoires" });
        }

        const nouveauProduit = new Product({ 
            nom, 
            prix, 
            image, 
            categorie, 
            description, 
            stock: stock || 0 
        });

        await nouveauProduit.save();
        res.status(201).json(nouveauProduit);
    } catch (err) {
        console.error("Erreur POST produit:", err);
        res.status(400).json({ message: "Données invalides", error: err.message });
    }
});

// 🟠 PUT : Modifier un produit (Admin seulement)
router.put("/:id", async (req, res) => {
    try {
        const { nom, prix, image, categorie, description, stock } = req.body;

        const produitUpdate = await Product.findByIdAndUpdate(
            req.params.id,
            { 
                nom, 
                prix, 
                image, 
                categorie, 
                description, 
                stock 
            },
            { new: true, runValidators: true } // runValidators force Mongoose à vérifier les types
        );

        if (!produitUpdate) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        res.json(produitUpdate);
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de la mise à jour", error: err.message });
    }
});

// 🔴 DELETE : Supprimer un produit (Admin seulement)
router.delete("/:id", async (req, res) => {
    try {
        const produitSupprime = await Product.findByIdAndDelete(req.params.id);
        
        if (!produitSupprime) {
            return res.status(404).json({ message: "Le produit n'existe déjà plus" });
        }

        res.json({ message: "Produit retiré du catalogue" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
});

module.exports = router;