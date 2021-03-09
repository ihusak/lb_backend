const Payments = require('../models/payments');

exports.getPayments = (req, res) => {
  Payments.getPayments((err, payments) => {
    if(err) return res.sendStatus(500);
    return res.json(payments);
  })
}

exports.getPaymentsByUserId = (req, res) => {
  const userId = req.params.userId;
  Payments.getPaymentsByUserId(userId, (err, payments) => {
    if(err) return res.sendStatus(500);
    return res.json(payments);
  })
}

exports.checkout = (req, res) => {
  const checkout = req.body.checkout;
  Payments.checkout(checkout, (err, result) => {
    if(err) return res.sendStatus(500);
    return res.json(result);
  })
}

exports.preparePayment = (req, res) => {
  const payment = req.body.payment;
  Payments.preparePayment(payment, (err, data) => {
    if(err) return res.sendStatus(500);
    return res.json(data);
  })
}