const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const controller = require('../../controllers/shop');

router.get('/products', auth.authUser, controller.getAllProducts);
router.post('/products', auth.authUser, controller.createProduct);
router.put('/products/:id', auth.authUser, controller.updateProduct);
router.delete('/products/:id', auth.authUser, controller.deleteProduct);

module.exports = router;
