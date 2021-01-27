const db = require('../config/db');

exports.all = (cb) => {
  db.get().collection('roles').find({}, {projection:{_id:0}}).toArray((err, roles) => {
    roles.map(role => {
      delete role.__v;
      return role;
    })
    cb(err, roles);
  })
};