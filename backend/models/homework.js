const db = require('../config/db');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

exports.createHomework = (homework, cb) => {
  db.get().collection('homeworks').insertOne(homework, (err, doc) => {
    cb(err, doc);
  });
};
