const express = require("express");
const bcrypt = require("bcryptjs");
const sequelize = require("../db"); // your Sequelize instance
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, password: hash });
    res.json({ message: "User created successfully" });
  } catch (err) {
    res.json({ message: "Error: " + err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (valid) res.json({ message: "Login successful" });
  else res.json({ message: "Invalid password" });
});
// Change Password
router.post("/change-password", async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    console.log("🟡 Change password request for:", username);

    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      console.log("❌ Incorrect current password");
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    user.password = newHash;
    await user.save();

    console.log("✅ Password updated successfully for:", username);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Error updating password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// ✅ Get all users
router.get("/users", async (req, res) => {
  const users = await User.findAll({ attributes: ["username", "createdAt"] });
  res.json(users);
});

// ✅ Delete user by username
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
