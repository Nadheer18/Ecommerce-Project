const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./db");

const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/products");

const app = express();

// -------------------------------
// CORS SETTINGS
// -------------------------------
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(bodyParser.json());

// -------------------------------
// TEST ROUTE
// -------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully! ✅" });
});

// -------------------------------
// ROUTES
// -------------------------------
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);

// -------------------------------
// STATIC FILE SERVING FOR UPLOADS
// -------------------------------
app.use("/uploads", express.static("uploads"));

// -------------------------------
// START SERVER
// -------------------------------
sequelize.sync().then(() => {
  app.listen(3000, "0.0.0.0", () =>
    console.log("✅ Server running on port 3000")
  );
});

