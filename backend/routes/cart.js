// backend/routes/cart.js
const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth'); // your JWT auth middleware

router.use(authMiddleware); // all cart routes require auth

router.get('/', cartCtrl.getCart);                   // GET /api/cart
router.post('/', cartCtrl.addToCart);                // POST /api/cart { productId, quantity }
router.put('/:id', cartCtrl.updateQuantity);         // PUT /api/cart/:id { quantity }
router.delete('/:id', cartCtrl.removeItem);          // DELETE /api/cart/:id
router.delete('/', cartCtrl.clearCart);              // DELETE /api/cart  (clear all)

module.exports = router;

