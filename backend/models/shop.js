const db = require('../config/db');
const tableName = 'products';
const ObjectID = require('mongodb').ObjectID;

exports.all = (cb) => {
  db.get().collection(tableName).find({}).toArray((err, products) => {
    const mappedProducts = products.map(product => {
      product.id = product._id;
      delete product._id;
      return product;
    })
    cb(err, mappedProducts);
  });
};

exports.getById = (id, cb) => {
  db.get().collection(tableName).findOne({'_id': new ObjectID(id)}, (err, product) => {
    product.id = product._id;
    delete product._id;
    cb(err, product);
  })
};

exports.create = (product, cb) => {
  db.get().collection(tableName).insertOne(product, (err, doc) => {
    const createdProduct = doc.ops[0];
    createdProduct.id = createdProduct._id;
    delete createdProduct._id;
    cb(err, createdProduct);
  })
};

exports.update = (id, product, cb) => {
  db.get().collection(tableName).findOneAndUpdate({_id: new ObjectID(id)}, {$set: product}, (err, doc) => {
    doc.value.id = doc.value._id;
    delete doc.value._id;
    cb(err, doc.value);
  });
};

exports.delete = (id, cb) => {
  console.log('delete ID', id);
  db.get().collection(tableName).deleteOne({_id: new ObjectID(id)}, (err, doc) => {
    cb(err, doc);
  });
}
