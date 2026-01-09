const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const sequelize = require("../db");

const db = {};

// Load all models
fs.readdirSync(__dirname)
  .filter(file => file !== "index.js" && file.endsWith(".js"))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Run associations AFTER all models are loaded
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

