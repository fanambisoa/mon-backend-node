const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, "Le nom du produit est obligatoire"],
    trim: true // Supprime les espaces inutiles avant/après
  },
  description: { 
    type: String,
    trim: true 
  },
  prix: { 
    type: Number, 
    required: [true, "Le prix est obligatoire"],
    min: [0, "Le prix ne peut pas être négatif"]
  },
  categorie: { 
    type: String, 
    required: [true, "La catégorie est obligatoire"],
    enum: ["Électronique", "Vêtements", "Maison", "Alimentation"] // Sécurise les choix
  },
  image: { 
    type: String, 
    default: "https://placehold.co/400x300?text=Produit"
  },
  stock: { 
    type: Number, 
    default: 0, 
    min: [0, "Le stock ne peut pas être inférieur à zéro"] 
  }
}, {
  timestamps: true // Ajoute automatiquement 'createdAt' et 'updatedAt'
});

// Exportation en tant que "Product" (souvent utilisé au singulier en Mongoose)
module.exports = mongoose.model('Product', ProduitSchema);