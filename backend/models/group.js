const db = require('../config/db');

exports.all = (cb) => {
  db.get().collection('groups').find({}).toArray((err, groups) => {
    groups.map(group => {
      group.id = group._id;
      delete group._id;
      delete group.__v;
      return group
    })
    cb(err, groups);
  })
};