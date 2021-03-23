const db = require('../config/db');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
const DATA_TABLE = 'homeworks';

exports.createHomework = (homework, cb) => {
  db.get().collection(DATA_TABLE).insertOne(homework, (err, doc) => {
    cb(err, doc);
  });
};

exports.getAllHomeworks = (cb) => {
  db.get().collection(DATA_TABLE).find({}).toArray((err, homeworks) => {
    cb(err, homeworks);
  })
}
