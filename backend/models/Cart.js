module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product"
    });
  };

  return Cart;
};

