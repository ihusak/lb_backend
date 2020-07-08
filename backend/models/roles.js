const db = require('../config/db');

exports.all = (cb) => {
  db.get().collection('roles').find({}, {projection:{_id:0}}).toArray((err, docs) => {
    cb(err, docs);
  })
};