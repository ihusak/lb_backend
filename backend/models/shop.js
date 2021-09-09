const db = require('../config/db');
const Product = require('./schemas/product');
const crypto = require('crypto');
const tableName = 'products';
const ObjectID = require('mongodb').ObjectID;
const product = require('./schemas/product');

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

exports.create = (product, cb) => {
  db.get().collection(tableName).insertOne(product, (err, doc) => {
    cb(err, doc.ops[0]);
  })
};

exports.update = (id, product, cb) => {
  db.get().collection(tableName).findOneAndUpdate({_id: new ObjectID(id)}, {$set: product}, (err, doc) => {
    cb(err, doc);
  });
};

exports.delete = (id, cb) => {
  db.get().collection(dbName).deleteOne({_id: new ObjectID(id)}, (err, doc) => {
    cb(err, doc);
  });
}