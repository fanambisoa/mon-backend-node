const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, "L'identifiant utilisateur est obligatoire"],
    index: true // Optimise la recherche des commandes par utilisateur
  },
  articles: [
    {
      produitId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true 
      },
      nom: { type: String, required: true },
      // Utilisation de 'min' pour éviter les prix négatifs
      prix: { type: Number, required: true, min: 0 },
      quantite: { type: Number, required: true, min: 1, default: 1 },
      image: String
    }
  ],
  total: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  statut: { 
    type: String, 
    default: 'En attente',
    trim: true,
    enum: {
      values: ['En attente', 'Confirmé', 'Livré', 'Annulé'],
      message: '{VALUE} n’est pas un statut valide'
    }
  }
}, { 
  // Remplace le champ 'date' manuel par les timestamps automatiques de Mongoose
  // Cela crée 'createdAt' et 'updatedAt' automatiquement
  timestamps: true 
});

// --- Amélioration Performance ---
// Index composé si tu cherches souvent les commandes d'un utilisateur par date
CommandeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Commande', CommandeSchema);