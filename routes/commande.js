const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Commande = require("../models/commandes");
const Product = require("../models/Products");

// 1. GET : Historique d'un utilisateur spécifique
router.get('/user/:userId', async (req, res) => {
  try {
    const commandes = await Commande.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'historique" });
  }
});

// 2. GET : Toutes les commandes (Pour l'Admin)
router.get('/admin/toutes', async (req, res) => {
  try {
    const commandes = await Commande.find().populate('userId', 'nom email').sort({ date: -1 });
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 3. PATCH : Mise à jour du statut (AJOUTÉ POUR FIXER LA 404)
router.patch('/:id/statut', async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const commandeUpdated = await Commande.findByIdAndUpdate(
      id,
      { statut: statut },
      { new: true } // Pour renvoyer l'objet modifié
    );

    if (!commandeUpdated) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    res.json(commandeUpdated);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
  }
});

// 4. POST : Création de commande avec déduction de stock
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId, articles, total } = req.body;

    for (const item of articles) {
      const p = await Product.findOneAndUpdate(
        { _id: item.produitId, stock: { $gte: item.quantite } },
        { $inc: { stock: -item.quantite } },
        { session, new: true }
      );
      if (!p) throw new Error(`Stock épuisé pour ${item.nom}`);
    }

    const nouvelleCommande = new Commande({ userId, articles, total });
    await nouvelleCommande.save({ session });

    await session.commitTransaction();
    res.status(201).json({ success: true, message: "Commande enregistrée" });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;