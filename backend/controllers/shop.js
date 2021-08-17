const Shop = require('../models/shop');
const Product = require('../models/schemas/product')

exports.createProduct = (req, res) => {
  const PRODUCT = new Product(req.body);
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

exports.updateProduct = (req, res) => {
  const ID = req.params.ID;
  const PRODUCT = req.body;
  Shop.update(ID, PRODUCT, (err, products) => {
    if(err) return res.sendStatus(500);
    return res.json(products);
  });
}

exports.deleteProduct = (req, res) => {
  const ID = req.params.ID;
  Shop.delete(ID, (err, products) => {
    if(err) return res.sendStatus(500);
    return res.json({status: 'deleted', ok: true});
  });
}