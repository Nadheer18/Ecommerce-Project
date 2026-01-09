const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./db");
require("./models"); // ⭐ IMPORTANT — loads all models

const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/products");
const supportRouter = require("./routes/support");
const cartRoutes = require("./routes/cart");

const app = express();

app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE"] }));
app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use("/api/support", supportRouter);
app.use("/api/cart", cartRoutes);

app.get("/", (_, res) => res.json({ message: "Backend OK" }));

// ⭐ AUTO CREATE TABLES
sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced");
    app.listen(3000, "0.0.0.0", () =>
      console.log("🚀 Server running on port 3000")
    );
  })
  .catch(err => console.error("❌ DB sync failed", err));

