const express = require("express");
const bcrypt = require("bcryptjs");
const sequelize = require("../db"); // Sequelize instance
const { DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");

const router = express.Router();

// =========================
// USER MODEL
// =========================
const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

// =========================
// REGISTER USER
// =========================
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });
    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
});

// =========================
// LOGIN (WITH JWT TOKEN)
// =========================
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid password" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      "mysecretkey",   // CHANGE THIS LATER
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      username: user.username
    });

  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

// =========================
// CHANGE PASSWORD
// =========================
router.post("/change-password", async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      return res.status(400).json({ message: "Incorrect current password" });

    const newHash = await bcrypt.hash(newPassword, 10);
    user.password = newHash;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
});

// =========================
// GET ALL USERS
// =========================
router.get("/users", async (req, res) => {
  const users = await User.findAll({ attributes: ["username", "createdAt"] });
  res.json(users);
});

// =========================
// DELETE USER
// =========================
router.delete("/delete/:username", async (req, res) => {
  const { username } = req.params;

  try {
    await User.destroy({ where: { username } });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});

module.exports = router;

