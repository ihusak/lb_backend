const db = require('../config/db');
const Checkout = require('./schemas/checkoutSchema');
const crypto = require('crypto');
const ObjectID = require('mongodb').ObjectID;

exports.getPayments = (cb) => {
  db.get().collection('payments').find({}).toArray((err, payments) => {
    const paymentsMapped = payments.map(payment => {
      payment.id = payment._id;
      delete payment._id;
      delete payment.__v;
      return payment
    })
    cb(err, paymentsMapped);
  })
}

exports.getPaymentsByUserId = (userId, cb) => {
  db.get().collection('payments').find({'user.id': userId}).toArray((err, payments) => {
    const paymentsMapped = payments.map(payment => {
      payment.id = payment._id;
      delete payment._id;
      delete payment.__v;
      return payment
    })
    cb(err, paymentsMapped);
  })
}

exports.checkout = (checkout, cb) => {
  const CHECKOUT = new Checkout({
    user: {
      id: checkout.user.id,
      name: checkout.user.name,
      roleName: checkout.user.roleId 
    },
    course: {
      id: checkout.course.id,
      name: checkout.course.name,
      description: checkout.course.description 
    },
    price: checkout.price,
    paid: checkout.paid
  });
  db.get().collection('payments').insertOne(CHECKOUT, (err, doc) => {
    cb(err, doc);
  });
};

exports.preparePayment = (payment, cb) => {
  const PAYMENT = {
    version: payment.version,
    public_key: payment.env ? 'i33841131564' : 'sandbox_i79588793891',
    private_key: payment.env ? 'wn5aQRK647KNRFCYkdBz5DuJ3uXcPdB0CkWDMMfp' : 'sandbox_OZ4sfstlrZWfjkldkXnDcOFty21Lq9SxWiEXBzi8',
    action: payment.action,
    amount: payment.amount,
    currency: payment.currency,
    description: payment.description,
    order_id: new ObjectID(payment.amount)
  };
  let json = JSON.stringify(PAYMENT);
  let buff = new Buffer.from(json);
  let data = buff.toString('base64');
  let sign_string = PAYMENT.private_key + data + PAYMENT.private_key;
  let shasum = crypto.createHash('sha1');
  shasum.update(sign_string);
  let signature = new Buffer.from(shasum.digest('hex'), 'hex').toString('base64');
  cb(null, {data, signature})
}
