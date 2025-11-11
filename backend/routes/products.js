const express = require('express');

const router = express.Router();

// Example route
router.get('/', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

module.exports = router;


// for now static data; later replace with Sequelize models
//
// const products = [
//
//   { id: 1, name: 'T-Shirt', price: 12.99 },
//
//     { id: 2, name: 'Mug', price: 6.5 }
//
//     ];
//
//
//
//     router.get('/', (req, res) => res.json(products));
//
//     router.get('/:id', (req, res) => {
//
//       const p = products.find(x => x.id === Number(req.params.id));
//
//         if (!p) return res.status(404).json({error: 'not found'});
//
//           res.json(p);
//
//           });
//
//
//
//           module.exports = router;
//
//
