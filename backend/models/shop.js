const db = require('../config/db');
const RolesEnum = require("../config/enum/roles");
const tableName = 'products';
const tableNameOrders = 'orders';
const ObjectID = require('mongodb').ObjectID;
const {
  orderLogger
} = require('../config/middleware/logger');

const ORDER_STATUSES = Object.freeze({
  PENDING: 'pending',
  READY: 'ready',
  ALL: 'all'
})

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
  db.get().collection(tableNameOrders).insertOne(order, (err, savedOrder) => {
    const CREATED_ORDER = savedOrder.ops[0];
    CREATED_ORDER.id = CREATED_ORDER._id;
    delete CREATED_ORDER._id;
    if(user.roleId === RolesEnum.STUDENT && order.paymentMethod !== 'price') {
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

exports.getOrders = (user, status, cb) => {
  const SEARCH = RolesEnum.ADMIN === user.roleId ? {} : {status};
  db.get().collection(tableNameOrders).find(SEARCH).toArray((err, orders) => {
    const ORDERS_MAPPED = orders.map((order) => {
      order.id = order._id;
      delete order._id;
      return order;
    }).filter((ord) => {
      return RolesEnum.ADMIN !== user.roleId ? ord.userId === user.id && ord.status !== ORDER_STATUSES.READY : true;
    });
    console.log('ORDERS_MAPPED', ORDERS_MAPPED);
    cb(err, ORDERS_MAPPED);
  });
}

exports.updateOrderStatus = (id, status, cb) => {
  db.get().collection(tableNameOrders).findOneAndUpdate({'_id': new ObjectID(id)}, {$set: {status: status}}, (err, response) => {
    orderLogger.info(`Order change status to ${status}`, {order: response.value})
    cb(err, response.value);
  });
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
