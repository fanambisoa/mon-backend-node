const sqlite3 = require("sqlite3").verbose();

// 📂 Création ou ouverture de la base
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.log("Erreur connexion DB ❌", err.message);
  } else {
    console.log("Base SQLite connectée ✅");
  }
});

// 🧱 Création de la table users
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telephone TEXT UNIQUE,
    password TEXT
  )
`, (err) => {
  if (err) {
    console.log("Erreur création table ❌", err.message);
  } else {
    console.log("Table users créée ou déjà existante ✅");
  }
});

module.exports = db;