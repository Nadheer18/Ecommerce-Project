const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "ecommerce_staging",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "Pass@123",
  {
    host: process.env.DB_HOST || "mysql",
    dialect: "mysql",
    port: 3306,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = sequelize;
