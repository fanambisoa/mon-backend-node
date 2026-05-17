const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./bdd/database");

// ✅ middlewares
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

// 🔍 TEST
app.get("/", (req, res) => {
  res.send("API OK 🚀");
});


// =========================
// ➕ CREATE
// =========================
app.post("/register", (req, res) => {
  const { telephone, password } = req.body;

  if (!telephone || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  db.run(
    "INSERT INTO users (telephone, password) VALUES (?, ?)",
    [telephone, password],
    function (err) {
      if (err) {
        console.error("INSERT ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Utilisateur créé ✅", id: this.lastID });
    }
  );
});


// =========================
// 📥 READ
// =========================
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      console.error("READ ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ data: rows });
  });
});


// =========================
// ✏️ UPDATE
// =========================
app.put("/users/:id", (req, res) => {
  const { telephone, password } = req.body;
  const { id } = req.params;

  console.log("UPDATE:", { id, telephone, password });

  if (!telephone || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  db.run(
    "UPDATE users SET telephone = ?, password = ? WHERE id = ?",
    [telephone, password, id],
    function (err) {
      if (err) {
        console.error("UPDATE ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "User non trouvé" });
      }

      res.json({ message: "Utilisateur modifié ✅" });
    }
  );
});


// =========================
// 🗑 DELETE
// =========================
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("DELETE ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "User non trouvé" });
    }

    res.json({ message: "Utilisateur supprimé ✅" });
  });
});


// =========================
// 🚀 START SERVER
// =========================
app.listen(5000, () => {
  console.log("Serveur lancé sur http://localhost:5000");
});