const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

const Product = sequelize.define("Product", {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  price: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  image: { 
    type: DataTypes.STRING 
  }
});

module.exports = Product;

