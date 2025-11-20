const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("ecommerce_db", "root", "Pass@123", {
  host: process.env.DB_HOST || 'mysql8',   // ✅ connect to Docker’s mapped port
  dialect: "mysql",
  port: 3306,
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((err) => console.error("❌ Unable to connect to the database:", err));

module.exports = sequelize;
