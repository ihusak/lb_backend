const Shop = require('../models/shop');
const Product = require('../models/schemas/product')

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
    console.log('err111'. err);
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
