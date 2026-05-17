
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, "Le nom est obligatoire"],
    trim: true 
  },
  telephone: { 
    type: String, 
    required: [true, "Le téléphone est obligatoire"],
    unique: true, // Empêche les doublons
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

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // ✅ On appelle next() une fois fini
  } catch (err) {
    console.log(err);
    next(err); // 🛑 On passe l'erreur à next pour que MongoDB ne sauvegarde pas n'importe quoi
  }
});
// Méthode pour comparer les mots de passe lors du login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);