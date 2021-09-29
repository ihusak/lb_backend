const Shop = require('../models/shop');
const Product = require('../models/schemas/product')
const {createTransporter} = require("../config/email");
const config = require("../../config.json");
const {mailTransporterLogger} = require("../config/middleware/logger");

const DELIVERY_METHOD = Object.freeze({
  POST: 'post',
  TAKE_SWAY: 'take_away'
});
const PAYMENT_METHOD = Object.freeze({
  SKILLZ: 'skillz',
  PRICE: 'price'
})

exports.checkout = (req, res) => {
  const ORDER = req.body.order;
  const USER = req.user;
  Shop.checkout(ORDER, USER, (err, savedOrder) => {
    if(err) return res.sendStatus(500);
    orderEmail(USER, ORDER);
    return res.json({'order': 'created'});
  });
}

exports.createProduct = (req, res) => {
  const product = JSON.parse(req.body.product);
  const PRODUCT = new Product({
    title: product.title,
    description: product.description,
    images: req.files ? req.files.map(file => file.path) : [],
    price: product.price,
    skillz: product.skillz,
    category: product.category,
    sizes: product.sizes,
    available: product.available,
    sale: product.sale,
    manufacturer: product.manufacturer,
  });
  Shop.create(PRODUCT, (err, products) => {
    if(err) return res.sendStatus(500);
    return res.json(products);
  });
}

exports.getAllProducts = (req, res) => {
  Shop.all((err, products) => {
    if(err) return res.sendStatus(500);
    return res.json(products);
  });
}

exports.getProductById = (req, res) => {
  const ID = req.params.id;
  Shop.getById(ID, (err, product) => {
    if(err) return res.sendStatus(500);
    return res.json(product);
  })
}

exports.updateProduct = (req, res) => {
  const ID = req.params.id;
  const PRODUCT = JSON.parse(req.body.product);
  const newImages = req.files ? req.files.map(file => file.path) : [];
  PRODUCT.images = newImages.concat(PRODUCT.images);
  Shop.update(ID, PRODUCT, (err, products) => {
    if(err) return res.sendStatus(500);
    return res.json(products);
  });
}

exports.deleteProduct = (req, res) => {
  const ID = req.params.id;
  Shop.delete(ID, (err, products) => {
    if(err) return res.sendStatus(500);
    return res.json({status: 'deleted', ok: true});
  });
}
orderEmail = async (user, order) => {
  const transporter = await createTransporter();
  const DELIVERY = order.delivery === DELIVERY_METHOD.POST ? 'Доставка на почту' : 'Заберу сам';
  const PAYMENT = order.paymentMethod === PAYMENT_METHOD.SKILLZ ? PAYMENT_METHOD.SKILLZ : 'UAH на карту';
  const PAYMENT_SUFFIX = order.paymentMethod === PAYMENT_METHOD.SKILLZ ? PAYMENT_METHOD.SKILLZ : 'UAH';
  const mailOptions = {
    from: 'afreestylers2016@gmail.com', // sender address
    to: 'ilyagusak@gmail.com', // list of receivers
    subject: `Заказ № ${order.id}`, // Subject line
    html: `
      <h3>Заказчик: ${order.name} ${order.surName}</h3>
      <ul>
        <b>Информация по заказу</b>
        <li>Тел: ${order.phone}</li>
        <li>Город: ${order.city}</li>
        <li>Доставка: ${DELIVERY}</li>
        <li>Адрес: ${order.address ? order.address : '-'}</li>
        <li>Дополнительное инфо: ${order.additionInfo}</li>
        <li>Цена заказа: ${order.sum} ${PAYMENT_SUFFIX}</li>
        <li>Оплата: ${PAYMENT}</li>
      </ul>
    `,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      mailTransporterLogger.info('Mail sending error', err);
      console.log(err);
    } else {
      mailTransporterLogger.info('Mail sending info', info);
      console.log(info);
    }
  });
};
