const express = require("express");
const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const router = express.Router();

// Import or define User model
const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

// 🟢 Permanent admin credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "Admin@123";

// ✅ Admin login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ message: "Admin login successful" });
  } else {
    res.status(401).json({ message: "Invalid admin credentials" });
  }
});

// ✅ Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "password", "createdAt"],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// ✅ Delete user by ID
// ✅ Delete user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await User.destroy({ where: { id } });
    if (deleted) res.json({ message: "User deleted successfully" });
    else res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});


module.exports = router;

