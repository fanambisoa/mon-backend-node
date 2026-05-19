const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 1. Définition du Schéma (Ce qui manquait au début du fichier)
const userSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, "Le nom est obligatoire"],
    trim: true 
  },
  telephone: { 
    type: String, 
    required: [true, "Le téléphone est obligatoire"],
    unique: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, "Le mot de passe est obligatoire"],
    minlength: 6 
  },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  }
}, { timestamps: true });

// 2. Middleware pour hacher le mot de passe (Corrigé sans next)
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.error("Erreur de hachage:", err);
    throw err; 
  }
});

// 3. Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 4. Export du modèle
module.exports = mongoose.model("User", userSchema);