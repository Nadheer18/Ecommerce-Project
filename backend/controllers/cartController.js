// backend/controllers/cartController.js
const { Cart, Product } = require('../models');

module.exports = {
  // Get cart for logged user
  async getCart(req, res) {
    try {
      const userId = req.user.id; // assume req.user added by auth middleware
      const items = await Cart.findAll({
        where: { userId },
        include: [{ model: Product, as: 'product' }]
      });
      return res.json({ success: true, items });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  },

  // Add product to cart (or increase quantity if exists)
  async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity = 1 } = req.body;

      // optional: check product exists and stock
      const product = await Product.findByPk(productId);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

      const [cartItem, created] = await Cart.findOrCreate({
        where: { userId, productId },
        defaults: { quantity }
      });

      if (!created) {
        cartItem.quantity = cartItem.quantity + Number(quantity);
        await cartItem.save();
      }

      return res.json({ success: true, item: cartItem });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  },

  // Update quantity
  async updateQuantity(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params; // cart item id
      const { quantity } = req.body;
      if (quantity < 1) return res.status(400).json({ success: false, message: 'Quantity must be >= 1' });

      const item = await Cart.findOne({ where: { id, userId }});
      if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });

      item.quantity = quantity;
      await item.save();
      return res.json({ success: true, item });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  },

  // Remove item
  async removeItem(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const deleted = await Cart.destroy({ where: { id, userId }});
      if (!deleted) return res.status(404).json({ success: false, message: 'Cart item not found' });
      return res.json({ success: true, message: 'Item removed' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  },

  // Clear cart (optional)
  async clearCart(req, res) {
    try {
      const userId = req.user.id;
      await Cart.destroy({ where: { userId }});
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }
};

