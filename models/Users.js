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