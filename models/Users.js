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

// Modifié : Plus besoin de "next" avec async/await !
userSchema.pre("save", async function() {
  // Si le mot de passe n'a pas changé, on quitte simplement la fonction (sans next)
  if (!this.isModified("password")) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // ✅ Plus besoin de appeler next(), Mongoose sait que c'est fini dès que le try se termine
  } catch (err) {
    console.error("Erreur de hachage:", err);
    throw err; // 🛑 Au lieu de next(err), on "throw" l'erreur pour bloquer la sauvegarde
  }
});

// Méthode pour comparer les mots de passe lors du login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);