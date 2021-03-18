const db = require('../config/db');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

exports.createHomework = (hm, cb) => {
  db.get().collection('homeworks').insertOne(hm, (err, doc) => {
    cb(err, doc);
  });
};
