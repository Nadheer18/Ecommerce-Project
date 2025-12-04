const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/Product");

// -------------------------------
// MULTER STORAGE CONFIG
// -------------------------------
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });

// -------------------------------
// IMAGE UPLOAD ROUTE
// -------------------------------
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "Image uploaded successfully!",
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

// -------------------------------
// ADD NEW PRODUCT
// -------------------------------
router.post("/", async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const product = await Product.create({ name, price, image });
    res.json({ message: "Product added!", product });
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
});

// -------------------------------
// GET ALL PRODUCTS
// -------------------------------
router.get("/", async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

// -------------------------------
// DELETE PRODUCT
// -------------------------------
router.delete("/:id", async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

module.exports = router;

