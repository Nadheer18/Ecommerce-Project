const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./db");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");

const app = express();

// ✅ Enable CORS for your frontend (allow all for now)
app.use(cors({
  origin: "*", // or "http://192.168.75.150:3001"
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(bodyParser.json());

// ✅ Test endpoint (to verify backend works)
app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully ✅" });
});

// ✅ Auth routes
app.use("/api/auth", authRouter);

app.use("/api/admin", adminRouter);
// ✅ Start server
sequelize.sync().then(() => {
  app.listen(3000, "0.0.0.0", () => console.log("✅ Server running on port 3000"));
});

