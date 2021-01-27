const db = require('../config/db');
const Group = require('../models/schemas/groupsSchema');

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

exports.createGroup = (req, cb) => {
  console.log(req.body, req.user);
  const group = new Group({
    name: req.body.groupName,
    forAll: req.body.forAll,
    coachId: req.body.coachId,
    price: req.body.price
  });
  db.get().collection('groups').insertOne(group, (err, doc) => {
    cb(err, doc.ops[0]);
  })
}
