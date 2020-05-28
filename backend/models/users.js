const db = require('../config/db');

exports.all = (cb) => {
  db.get().collection('users').find({}).toArray((err, docs) => {
    cb(err, docs);
  })
};

exports.createUser = (user, cb) => {
  db.get().collection('users').insertOne(user, (err, docs) => {
    cb(err, docs);
  })
};
exports.getUserById = (id, cb) => {
  db.get().collection('users').findOne(id, (err, doc) => {
    cb(err, doc);
  })
};

exports.deleteUser = (id, cb) => {
  db.get().collection('users').remove(id, (err, doc) => {
    cb(err, doc);
  })
};

exports.updateUser = (updatedUser, id, cb) => {
  db.get().collection('users').update(id, updatedUser, (err, doc) => {
    cb(err, doc);
  })
};