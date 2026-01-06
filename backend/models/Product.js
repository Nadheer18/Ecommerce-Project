// backend/models/Product.js

module.exports = (sequelize, DataTypes) => {
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

  Product.associate = (models) => {
    // Add associations here if needed (ecom → none yet)
  };

  return Product;
};

