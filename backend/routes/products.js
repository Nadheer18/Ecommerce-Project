const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ Get all products
router.get("/", async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

// ✅ Add new product
router.post("/", async (req, res) => {
  const { name, price, image } = req.body;
  try {
    const newProduct = await Product.create({ name, price, image });
    res.json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
});

// ✅ Update product
router.put("/:id", async (req, res) => {
  const { name, price, image } = req.body;
  try {
    await Product.update({ name, price, image }, { where: { id: req.params.id } });
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
});

// ✅ Delete product
router.delete("/:id", async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

module.exports = router;

