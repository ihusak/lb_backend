const db = require('../config/db');
const RolesEnum = require("../config/enum/roles");
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

exports.checkout = (order, user, cb) => {
  const table = defineUserInfoTable(user.roleId);
  db.get().collection('orders').insertOne(order, (err, savedOrder) => {
    const CREATED_ORDER = savedOrder.ops[0];
    CREATED_ORDER.id = CREATED_ORDER._id;
    delete CREATED_ORDER._id;
    if(user.roleId === RolesEnum.STUDENT) {
      db.get().collection(table).findOne({'id': user.id}, (err, userInfo) => {
        const RESULT = userInfo.rating - order.sum;
        db.get().collection(table).updateOne({'id': user.id},{ $set: { 'rating' : RESULT } });
        cb(err, CREATED_ORDER);
      });
    } else {
      cb(err, CREATED_ORDER);
    }
  })
}

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

defineUserInfoTable = (roleId) => {
  let table = '';
  switch (parseInt(roleId)) {
    case RolesEnum.ADMIN: table = 'userAdminInfo'; break;
    case RolesEnum.STUDENT: table = 'userStudentInfo'; break;
    case RolesEnum.COACH: table = 'userCoachInfo'; break;
    case RolesEnum.PARENT: table = 'userParentInfo'; break;
  }
  return table;
}
