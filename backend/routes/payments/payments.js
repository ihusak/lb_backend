const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const controller = require('../../controllers/payments');

router.get('/payments', auth.authUser, controller.getPayments);
router.get('/user/:userId/payments', auth.authUser, controller.getPaymentsByUserId);
router.post('/create', auth.authUser, controller.preparePayment);
router.post('/checkout', auth.authUser, controller.checkout);

module.exports = router;